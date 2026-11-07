from pathlib import Path
from zipfile import ZipFile, ZIP_STORED

root = Path('D:/codex/rain-sleep')
source = root / 'dist/nature-sleep-v4.apk'
target = root / 'dist/volume-patched-unsigned.apk'
asset = 'assets/media/binaural-balanced.wav'
with ZipFile(source) as original, ZipFile(target, 'w') as updated:
    for entry in original.infolist():
        if entry.filename.startswith('META-INF/'):
            continue
        if entry.filename == asset:
            updated.write(root / 'web/media/binaural-balanced.wav', asset, compress_type=ZIP_STORED)
        else:
            updated.writestr(entry, original.read(entry.filename))
print(target)
