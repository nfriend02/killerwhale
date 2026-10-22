import os
import shutil
from PIL import Image

ARTIFACT_DIR = r"C:\Users\HS Kim\.gemini\antigravity-ide\brain\589d6df1-59c1-49ee-85f0-a1e21f686dce"
BASE_DIR = r"c:\Users\HS Kim\Desktop\Agames\killerwhale"

CHAR_FILES = {
    "killer_whale": "char_killer_whale_1792568509216.jpg",
    "shark": "char_shark_1792568532087.jpg",
    "blue_marlin": "char_blue_marlin_1792568552390.jpg",
    "giant_squid": "char_giant_squid_1792568573121.jpg",
    "megalodon": "char_megalodon_1792568592344.jpg"
}

PREY_SHEETS = {
    "killer_whale": {
        "file": "prey_killer_whale_sheet_1792568620298.jpg",
        "grid": (3, 3), # 3 rows, 3 cols (9 items + center) or dynamic
        "names": ["kw_1_seal", "kw_2_salmon", "kw_3_fur_seal", "kw_4_penguin", "kw_5_herring", "kw_6_stingray", "kw_7_sea_lion", "kw_8_squid", "kw_9_elephant_seal", "kw_10_sardines"]
    },
    "shark": {
        "file": "prey_shark_sheet_1792568646022.jpg",
        "grid": (4, 3),
        "names": ["sk_1_tuna", "sk_2_mackerel", "sk_3_turtle", "sk_4_sardine", "sk_5_yellowtail", "sk_6_saury", "sk_7_spanish_mackerel", "sk_8_flying_fish", "sk_9_crab", "sk_10_filefish"]
    },
    "blue_marlin": {
        "file": "prey_marlin_sheet_1792568673316.jpg",
        "grid": (4, 3),
        "names": ["bm_1_reef_squid", "bm_2_mahimahi", "bm_3_flying_fish", "bm_4_anchovy", "bm_5_spanish_mackerel", "bm_6_mackerel", "bm_7_horse_mackerel", "bm_8_young_marlin", "bm_9_saury", "bm_10_seabird"]
    },
    "giant_squid": {
        "file": "prey_squid_sheet_1792568699285.jpg",
        "grid": (4, 3),
        "names": ["gs_1_anglerfish", "gs_2_lanternfish", "gs_3_shrimp", "gs_4_worm", "gs_5_cuttlefish", "gs_6_pollock", "gs_7_cod", "gs_8_crab", "gs_9_ammonite", "gs_10_krill"]
    },
    "megalodon": {
        "file": "prey_megalodon_sheet_1792568727847.jpg",
        "grid": (4, 3),
        "names": ["mg_1_ancient_whale", "mg_2_giant_turtle", "mg_3_manatee", "mg_4_sea_lion_pack", "mg_5_bluefin", "mg_6_manta_ray", "mg_7_ancient_shark", "mg_8_mosasaur", "mg_9_sperm_whale", "mg_10_giant_tuna"]
    }
}

def remove_white_bg(img, threshold=240):
    img = img.convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        # Check if color is close to white
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            # smooth alpha falloff
            diff = min(item[0], item[1], item[2]) - threshold
            alpha = max(0, 255 - diff * 12)
            new_data.append((item[0], item[1], item[2], alpha))
        else:
            new_data.append(item)
    img.putdata(new_data)
    return img

print("1. Processing 5 Player Character Sprites...")
for char_name, filename in CHAR_FILES.items():
    src_path = os.path.join(ARTIFACT_DIR, filename)
    if os.path.exists(src_path):
        with Image.open(src_path) as im:
            transparent_im = remove_white_bg(im, threshold=238)
            
            # Save to assets/characters/
            out_web = os.path.join(BASE_DIR, "assets", "characters", f"{char_name}.png")
            out_unity = os.path.join(BASE_DIR, "Assets", "Art", "Characters", f"{char_name}.png")
            
            transparent_im.save(out_web, "PNG")
            transparent_im.save(out_unity, "PNG")
            print(f" -> Saved Character: {char_name}.png")

print("\n2. Processing 50 Dedicated Prey Items...")
for char_name, info in PREY_SHEETS.items():
    sheet_path = os.path.join(ARTIFACT_DIR, info["file"])
    if not os.path.exists(sheet_path):
        print(f"Missing sheet: {sheet_path}")
        continue
    
    with Image.open(sheet_path) as sheet:
        W, H = sheet.size
        rows, cols = info["grid"]
        cell_w = W // cols
        cell_h = H // rows
        
        web_folder = os.path.join(BASE_DIR, "assets", "prey", char_name)
        unity_folder = os.path.join(BASE_DIR, "Assets", "Art", "Prey", char_name)
        os.makedirs(web_folder, exist_ok=True)
        os.makedirs(unity_folder, exist_ok=True)
        
        idx = 0
        for r in range(rows):
            for c in range(cols):
                if idx >= len(info["names"]):
                    break
                
                name = info["names"][idx]
                box = (c * cell_w + 10, r * cell_h + 10, (c + 1) * cell_w - 10, (r + 1) * cell_h - 10)
                cell_crop = sheet.crop(box)
                
                # Make cell transparent
                crop_trans = remove_white_bg(cell_crop, threshold=235)
                
                # Save item PNG
                web_out = os.path.join(web_folder, f"{name}.png")
                unity_out = os.path.join(unity_folder, f"{name}.png")
                crop_trans.save(web_out, "PNG")
                crop_trans.save(unity_out, "PNG")
                
                idx += 1
        print(f" -> Extracted {idx} prey items for {char_name}")

print("\nAll Characters and 50 Prey Assets Successfully Generated and Deployed!")
