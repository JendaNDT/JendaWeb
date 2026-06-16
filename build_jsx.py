import os

jsx_files = [
    'tweaks-panel.jsx',
    'shared.jsx',
    'nav-hero.jsx',
    'apps-music.jsx',
    'player-contact.jsx',
    'player-expand.jsx',
    'queue.jsx',
    'extras.jsx',
    'search.jsx',
    'app.jsx'
]

combined_path = "/Users/jenda/Desktop/JendaWeb/combined.jsx"

print("Combining JSX files...")
combined_code = []
for file in jsx_files:
    path = os.path.join("/Users/jenda/Desktop/JendaWeb", file)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            code = f.read()
        combined_code.append(f"\n// ==========================================\n// FILE: {file}\n// ==========================================\n")
        combined_code.append(code)
    else:
        print(f"Warning: {file} not found!")

with open(combined_path, "w", encoding="utf-8") as f:
    f.write("".join(combined_code))

print(f"Successfully created combined.jsx ({os.path.getsize(combined_path)} bytes)!")
