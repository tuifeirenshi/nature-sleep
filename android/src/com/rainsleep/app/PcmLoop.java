package com.rainsleep.app;

import android.content.res.AssetManager;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioTrack;
import java.io.DataInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ExecutionException;

final class PcmLoop {
 private static final ExecutorService preloader=Executors.newSingleThreadExecutor();
 private static String cachedName;
 private static Future<PcmData> cachedData;
 private static final class PcmData {
  final byte[] pcm; final int channels,rate;
  PcmData(byte[] pcm,int channels,int rate){this.pcm=pcm;this.channels=channels;this.rate=rate;}
 }
 static synchronized void preload(AssetManager assets,String name){
  if(name.equals(cachedName)&&cachedData!=null)return;
  if(cachedData!=null&&!cachedData.isDone())cachedData.cancel(true);
  cachedName=name;cachedData=preloader.submit(()->read(assets,name));
 }
 private static PcmData prepared(AssetManager assets,String name)throws IOException{
  Future<PcmData> future;
  synchronized(PcmLoop.class){preload(assets,name);future=cachedData;}
  try{return future.get();}
  catch(InterruptedException e){Thread.currentThread().interrupt();throw new IOException("Audio preload interrupted",e);}
  catch(ExecutionException|java.util.concurrent.CancellationException e){
   synchronized(PcmLoop.class){if(cachedData==future){cachedData=null;cachedName=null;}}
   return read(assets,name);
  }
 }
 static int u16(DataInputStream in) throws IOException {return in.readUnsignedByte() | (in.readUnsignedByte()<<8);}
 static int u32(DataInputStream in) throws IOException {return u16(in) | (u16(in)<<16);}
 static String tag(DataInputStream in) throws IOException {byte[] b=new byte[4];in.readFully(b);return new String(b,StandardCharsets.US_ASCII);}
 private static PcmData read(AssetManager assets,String name) throws IOException {
  byte[] pcm=null;int channels=0,rate=0,bits=0,encoding=0;
  try(DataInputStream in=new DataInputStream(assets.open(name))){
   if(!tag(in).equals("RIFF"))throw new IOException("Not a RIFF WAV");u32(in);
   if(!tag(in).equals("WAVE"))throw new IOException("Not WAVE");
   while(pcm==null){String chunk=tag(in);int length=u32(in);if(length<0)throw new IOException("Invalid chunk size");
    if(chunk.equals("fmt ")){if(length<16)throw new IOException("Invalid WAV format");encoding=u16(in);channels=u16(in);rate=u32(in);u32(in);u16(in);bits=u16(in);skip(in,length-16);}
    else if(chunk.equals("data")){if(encoding!=1||bits!=16||channels<1||channels>2||rate<=0)throw new IOException("Unsupported PCM format");pcm=new byte[length];in.readFully(pcm);}
    else skip(in,length);
    if((length&1)!=0)in.readByte();
   }
  }
  int frameSize=channels*2;if(pcm.length==0||pcm.length%frameSize!=0)throw new IOException("Invalid PCM frames");
  return new PcmData(pcm,channels,rate);
 }
 static AudioTrack load(AssetManager assets,String name) throws IOException {
  PcmData data=prepared(assets,name);byte[] pcm=data.pcm;int channels=data.channels,rate=data.rate;
  int frameSize=channels*2;
  AudioTrack audio=new AudioTrack.Builder().setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA).setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build()).setAudioFormat(new AudioFormat.Builder().setEncoding(AudioFormat.ENCODING_PCM_16BIT).setSampleRate(rate).setChannelMask(channels==2?AudioFormat.CHANNEL_OUT_STEREO:AudioFormat.CHANNEL_OUT_MONO).build()).setTransferMode(AudioTrack.MODE_STATIC).setBufferSizeInBytes(pcm.length).build();
  try{if(audio.write(pcm,0,pcm.length)!=pcm.length)throw new IOException("PCM upload failed");if(audio.setLoopPoints(0,pcm.length/frameSize,-1)!=AudioTrack.SUCCESS)throw new IOException("Loop setup failed");audio.setVolume(0);return audio;}catch(Exception e){audio.release();throw new IOException("Audio loop initialization failed",e);}
 }
 static void skip(DataInputStream in,int bytes)throws IOException{while(bytes>0){int n=in.skipBytes(bytes);if(n==0){in.readByte();n=1;}bytes-=n;}}
}
