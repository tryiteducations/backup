src = open("src/lib/themes.js", encoding="utf-8").read()

# Rename all themes to Indian Soul Names
renames = [
    ("name: 'Blue & White'", "name: 'Jasmine at Dawn'"),
    ("name: 'Rose & White'", "name: 'Lotus in Bloom'"),
    ("name: 'Sky Fresh'", "name: 'Andaman Sky'"),
    ("name: 'Emerald Clean'", "name: 'Kerala Backwater'"),
    ("name: 'Violet Soft'", "name: 'Nilambari Dusk'"),
    ("name: 'Coral Bright'", "name: 'Saffron Sunrise'"),
    ("name: 'Karur Sunset'", "name: 'Karur Twilight'"),
    ("name: 'Midnight Blue'", "name: 'Midnight Ganges'"),
    ("name: 'Pink Night'", "name: 'Gulab Raat'"),
    ("name: 'Tamil Nadu'", "name: 'Madurai Kovil'"),
    ("name: 'Kerala Green'", "name: 'Wayanad Forest'"),
    ("name: 'Rajasthan Desert'", "name: 'Thar Shimmer'"),
    ("name: 'Bengal Gold'", "name: 'Sundarbans Gold'"),
    ("name: 'Punjab Harvest'", "name: 'Baisakhi Breeze'"),
    ("name: 'Focus Mode'", "name: 'Abhyas Neel'"),
    ("name: 'Night Study'", "name: 'Ratri Adhyayan'"),
    ("name: 'Morning Fresh'", "name: 'Brahma Muhurta'"),
    ("name: 'Power Hour'", "name: 'Veer Shakti'"),
    ("name: 'Calm Study'", "name: 'Shant Sagar'"),
    ("name: 'Thunder Strike'", "name: 'Vajra Neel'"),
    ("name: 'Lava Core'", "name: 'Agni Chakra'"),
    ("name: 'Void Amethyst'", "name: 'Shoonya Amethyst'"),
    ("name: 'Arctic Pulse'", "name: 'Himalayan Pulse'"),
    ("name: 'Crimson Nova'", "name: 'Ratna Nova'"),
    ("name: 'Matrix Rain'", "name: 'Brahmastra Code'"),
    ("name: 'Copper Circuit'", "name: 'Tamra Vein'"),
    ("name: 'Nebula Drift'", "name: 'Nakshatra Drift'"),
    ("name: 'Carbon Elite'", "name: 'Carbon Chakra'"),
    ("name: 'Gold Vault'", "name: 'Swarna Kosh'"),
    ("name: 'Sakura Morning'", "name: 'Vasant Panchami'"),
    ("name: 'Bamboo Zen'", "name: 'Aranya Zen'"),
    ("name: 'Cloud Nine'", "name: 'Megha Nava'"),
    ("name: 'Arctic White'", "name: 'Kailash White'"),
    ("name: 'Lagoon'", "name: 'Chilika Lagoon'"),
    ("name: 'Golden Hour'", "name: 'Suvarnam Hour'"),
    ("name: 'Sunrise'", "name: 'Brahma Sunrise'"),
    ("name: 'Ocean Deep'", "name: 'Sagara Deep'"),
    ("name: 'Calmness'", "name: 'Shanti Vana'"),
    ("name: 'Energetic'", "name: 'Tej Shakti'"),
    ("name: 'Hyper Focus'", "name: 'Ekagrata'"),
    ("name: 'Professional'", "name: 'Vyavsayi'"),
    ("name: 'Night Owl'", "name: 'Ratri Uluka'"),
    ("name: 'Forest'", "name: 'Vana Prastha'"),
    ("name: 'Bharat'", "name: 'Bharat Mata'"),
    ("name: 'Fire & Roar'", "name: 'Agni Simha'"),
    ("name: 'Cherry Blossom'", "name: 'Vasant Kusuma'"),
    ("name: 'Galaxy'", "name: 'Akash Ganga'"),
    ("name: 'Crimson Edge'", "name: 'Lohit Dhara'"),
    ("name: 'Desert Storm'", "name: 'Andhi Toofan'"),
    ("name: 'TryIT Classic'", "name: 'TryIT Classic'"),
    ("name: 'High Contrast'", "name: 'Spashta Drishti'"),
    ("name: 'Midnight'", "name: 'Ardha Ratri'"),
    ("name: 'Imperial Throne'", "name: 'Samrat Simhasan'"),
    ("name: 'Style Icon'", "name: 'Shaili Icon'"),
    ("name: 'Iron Reign'", "name: 'Loha Rajya'"),
    ("name: 'Quantum Field'", "name: 'Parmanu Kshetra'"),
    ("name: 'Deep Orbit'", "name: 'Gahan Kaksha'"),
    ("name: 'Midnight Vigil'", "name: 'Nishi Jagran'"),
    ("name: 'Bioluma'", "name: 'Jeevan Prakash'"),
    ("name: 'Liberty Shield'", "name: 'Swatantra Kavach'"),
    ("name: 'Arcane Manor'", "name: 'Rahasya Mahal'"),
]

count = 0
for old, new in renames:
    if old in src:
        src = src.replace(old, new)
        count += 1
    
print(f"Renamed {count} themes")
open("src/lib/themes.js", "w", encoding="utf-8").write(src)
print("Done")
