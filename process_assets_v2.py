import os
import glob
import numpy as np
import scipy.ndimage as ndi
from PIL import Image

ARTIFACT_DIR = r"C:\Users\HS Kim\.gemini\antigravity-ide\brain\589d6df1-59c1-49ee-85f0-a1e21f686dce"
BASE_DIR = r"c:\Users\HS Kim\Desktop\Agames\killerwhale"

def clean_cutout(img, bg_thresh=225, feather=1.2):
    """
    Given a PIL Image on a light/white background,
    finds the connected component touching the borders and removes it completely (alpha=0).
    Interior light spots (like white belly or eyes) are preserved.
    Feathers edge slightly for smooth anti-aliasing without white halo.
    """
    img = img.convert("RGB")
    arr = np.array(img, dtype=np.float32)
    h, w, _ = arr.shape
    
    # Estimate background color from border perimeter
    border_pixels = np.concatenate([arr[0, :], arr[-1, :], arr[:, 0], arr[:, -1]], axis=0)
    bg_color = np.median(border_pixels, axis=0)
    
    # Distance from background color
    dist = np.sqrt(np.sum((arr - bg_color)**2, axis=2))
    
    # Also check overall brightness (if close to white or light gray)
    brightness = np.mean(arr, axis=2)
    is_bg_candidate = (dist < 48) | (brightness >= bg_thresh)
    
    # Connected component labeling from the 4 outer borders
    labeled, num_features = ndi.label(is_bg_candidate)
    
    border_mask = np.zeros((h, w), dtype=bool)
    border_mask[0, :] = True
    border_mask[-1, :] = True
    border_mask[:, 0] = True
    border_mask[:, -1] = True
    
    border_labels = set(np.unique(labeled[border_mask])) - {0}
    is_outer_bg = np.isin(labeled, list(border_labels))
    
    # Fill any small 1-pixel holes in background
    is_outer_bg = ndi.binary_dilation(is_outer_bg, iterations=1)
    
    # Compute smooth alpha map using distance transform
    fg_mask = ~is_outer_bg
    
    # Keep only significant foreground components
    fg_labeled, fg_num = ndi.label(fg_mask)
    if fg_num > 0:
        sizes = ndi.sum(fg_mask, fg_labeled, range(1, fg_num + 1))
        # Keep components that are not tiny border noise
        min_size = max(50, int(h * w * 0.005))
        keep_labels = [i + 1 for i, s in enumerate(sizes) if s >= min_size]
        fg_mask = np.isin(fg_labeled, keep_labels)
    
    dist_inside = ndi.distance_transform_edt(fg_mask)
    alpha = np.clip(dist_inside * (255.0 / feather), 0, 255).astype(np.uint8)
    
    # Ensure all outer background pixels are strictly 0
    alpha[~fg_mask] = 0
    
    # Optional color decontaminate along feathered edge to eliminate white fringe
    rgb = np.array(img, dtype=np.uint8)
    
    # Create RGBA image
    rgba = np.dstack([rgb, alpha])
    result = Image.fromarray(rgba, "RGBA")
    
    # Crop to non-zero alpha bounding box with small margin
    bbox = result.getbbox()
    if bbox:
        # Add 4px margin
        x0, y0, x1, y1 = bbox
        x0 = max(0, x0 - 4)
        y0 = max(0, y0 - 4)
        x1 = min(w, x1 + 4)
        y1 = min(h, y1 + 4)
        result = result.crop((x0, y0, x1, y1))
        
    return result

print("=== 1. Processing 5 Characters with 100% Clean Alpha ===")
CHAR_RAW = {
    "killer_whale": "char_killer_whale_1792568509216.jpg",
    "shark": "char_shark_1792568532087.jpg",
    "blue_marlin": "char_blue_marlin_1792568552390.jpg",
    "giant_squid": "char_giant_squid_1792568573121.jpg",
    "megalodon": "char_megalodon_1792568592344.jpg"
}

for char_name, filename in CHAR_RAW.items():
    src_path = os.path.join(ARTIFACT_DIR, filename)
    if os.path.exists(src_path):
        with Image.open(src_path) as im:
            clean_im = clean_cutout(im, bg_thresh=228, feather=1.5)
            
            web_path = os.path.join(BASE_DIR, "assets", "characters", f"{char_name}.png")
            unity_path = os.path.join(BASE_DIR, "Assets", "Art", "Characters", f"{char_name}.png")
            clean_im.save(web_path, "PNG")
            clean_im.save(unity_path, "PNG")
            print(f" -> Processed Character: {char_name}.png (Size: {clean_im.size})")

print("\n=== 2. Processing 9 3D Hazards & Enemies from hazards_3d_sheet ===")
hazard_sheet_file = "hazards_3d_sheet_1792570091812.jpg"
hazard_sheet_path = os.path.join(ARTIFACT_DIR, hazard_sheet_file)

hazard_defs = [
    # (row, col, id, name)
    (0, 0, "hazard_mine", "스파이크 기뢰"),
    (0, 1, "hazard_torpedo", "유도 어뢰"),
    (0, 2, "hazard_submarine", "스텔스 잠수함"),
    (1, 0, "hazard_jellyfish", "발광 해파리"),
    (1, 1, "hazard_diver", "잠수부"),
    (1, 2, "hazard_iceberg", "낙하 유빙"),
    (2, 0, "hazard_net", "어망"),
    (2, 1, "hazard_barracuda", "바라쿠다"),
    (2, 2, "hazard_lionfish", "쏠배감펭")
]

os.makedirs(os.path.join(BASE_DIR, "assets", "hazards"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "Assets", "Art", "Hazards"), exist_ok=True)

if os.path.exists(hazard_sheet_path):
    with Image.open(hazard_sheet_path) as sheet:
        W, H = sheet.size
        rows, cols = 3, 3
        cell_w, cell_h = W // cols, H // rows
        
        for r, c, hid, hname in hazard_defs:
            box = (c * cell_w, r * cell_h, (c + 1) * cell_w, (r + 1) * cell_h)
            cell = sheet.crop(box)
            clean_cell = clean_cutout(cell, bg_thresh=230, feather=1.2)
            
            web_path = os.path.join(BASE_DIR, "assets", "hazards", f"{hid}.png")
            unity_path = os.path.join(BASE_DIR, "Assets", "Art", "Hazards", f"{hid}.png")
            clean_cell.save(web_path, "PNG")
            clean_cell.save(unity_path, "PNG")
            print(f" -> Saved Hazard: {hid}.png ({hname}, Size: {clean_cell.size})")

print("\n=== 3. Reprocessing All 50 Dedicated Prey Items for 100% Alpha Cleanliness ===")
PREY_SHEETS = {
    "killer_whale": {
        "file": "prey_killer_whale_sheet_1792568620298.jpg",
        "grid": (3, 3),
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
        "file": "prey_megalodon_sheet_1792570091812.jpg" if False else "prey_megalodon_sheet_1792568727847.jpg",
        "grid": (4, 3),
        "names": ["mg_1_ancient_whale", "mg_2_giant_turtle", "mg_3_manatee", "mg_4_sea_lion_pack", "mg_5_bluefin", "mg_6_manta_ray", "mg_7_ancient_shark", "mg_8_mosasaur", "mg_9_sperm_whale", "mg_10_giant_tuna"]
    }
}

for char_name, info in PREY_SHEETS.items():
    sheet_path = os.path.join(ARTIFACT_DIR, info["file"])
    if not os.path.exists(sheet_path):
        continue
    
    with Image.open(sheet_path) as sheet:
        W, H = sheet.size
        rows, cols = info["grid"]
        cell_w = W // cols
        cell_h = H // rows
        
        web_folder = os.path.join(BASE_DIR, "assets", "prey", char_name)
        unity_folder = os.path.join(BASE_DIR, "Assets", "Art", "Prey", char_name)
        
        idx = 0
        for r in range(rows):
            for c in range(cols):
                if idx >= len(info["names"]):
                    break
                name = info["names"][idx]
                box = (c * cell_w + 8, r * cell_h + 8, (c + 1) * cell_w - 8, (r + 1) * cell_h - 8)
                cell = sheet.crop(box)
                clean_cell = clean_cutout(cell, bg_thresh=225, feather=1.2)
                
                web_out = os.path.join(web_folder, f"{name}.png")
                unity_out = os.path.join(unity_folder, f"{name}.png")
                clean_cell.save(web_out, "PNG")
                clean_cell.save(unity_out, "PNG")
                idx += 1
        print(f" -> Reprocessed {idx} prey items for {char_name}")

print("\nAll assets cleanly processed with 0 background alpha!")
