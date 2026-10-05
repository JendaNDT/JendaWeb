# Paperlings 1.0.0-rc2

Windows ZIP and Android APK both include the four user-supplied music tracks.
Source: https://github.com/JendaNDT/Lemmings-2026/commit/59fc41a0a1ff14ca96fdde761591e6fee2009257

Android is a new independent installation (`cool.jenda.paperlings`) with a
new release signature. It does not replace `org.lemmings2026.demo`, import
previous progress, or restore Android backups. New progress is saved normally.
Only the public certificate fingerprint is distributed. Private signing material
is never part of this repository or either download.

Validated: 97 GDScript files, 18 suites / 473 checks; actual Godot music mix,
looping, transitions and volume; both exported payloads load all four tracks;
APK signature, release manifest and 16 KiB zip alignment; no bundled saves;
Windows archive integrity; browser downloads match SHA-256. Actual Windows
and Android device tests remain pending. Windows is unsigned.

Public download page: https://jenda.cool/paperlings/
`SHA256SUMS.txt` covers both installers and third-party notices.
`manifest.json` records sizes, hashes, source and Android identity.
