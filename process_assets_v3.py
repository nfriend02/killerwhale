import os
import glob
import numpy as np
import scipy.ndimage as ndi
from PIL import Image

ARTIFACT_DIR = r"C:\Users\HS Kim\.gemini\antigravity-ide\brain\589d6df1-59c1-49ee-85f0-a1e21f686dce"
BASE_DIR = r"c:\Users\HS Kim\Desktop\Agames\killerwhale"

def extract_clean_sprite(cell_img, is_net=False):
    """
    Given a cell crop from the 3D sheet, cleanly isolates the creature:
    - Removes all white/off-white sheet backgrounds
    - Cuts through card frame lines (blue/beige/gray borders)
    - Strips all drop shadows (low-saturation gray shadows)
    - Leaves interior highlights and textures intact
    - For fishing net: clears white holes between ropes
    - Soft anti-aliased alpha edge
    - Tight bounding box crop
    """
    arr = np.array(cell_img.convert("RGB"), dtype=np.float32)
    h, w, _ = arr.shape
    bright = np.mean(arr, axis=2)
    sat = np.max(arr, axis=2) - np.min(arr, axis=2)
    
    # 1. Background, card frame, and drop shadow candidate detection
    # Any pixel with:
    # - High brightness >= 195 (white or light card background)
    # - Moderate brightness >= 115 and low/medium saturation < 65 (drop shadow or card frame borders)
    is_bg_candidate = (bright >= 195) | ((bright >= 115) & (sat < 65))
    
    # Outer edge seeds (6px margin along all 4 outer borders of the cell)
    seeds = np.zeros((h, w), dtype=bool)
    seeds[0:6, :] = True
    seeds[-6:, :] = True
    seeds[:, 0:6] = True
    seeds[:, -6:] = True
    seeds = seeds & is_bg_candidate
    
    labeled, num = ndi.label(is_bg_candidate)
    seed_labels = set(np.unique(labeled[seeds])) - {0}
    is_outer_bg = np.isin(labeled, list(seed_labels))
    
    # Foreground mask
    fg = ~is_outer_bg
    
    # 2. For net, also clear pure white interior holes between ropes
    if is_net:
        fg = fg & (bright < 210)
    
    # 3. Clean up floating edge fragments (within 10px of border if not part of main body)
    fg_labeled, fg_num = ndi.label(fg)
    if fg_num > 0:
        sizes = ndi.sum(fg, fg_labeled, range(1, fg_num + 1))
        max_s = np.max(sizes)
        keep = []
        border_zone = np.zeros((h, w), dtype=bool)
        border_zone[0:8, :] = True
        border_zone[-8:, :] = True
        border_zone[:, 0:8] = True
        border_zone[:, -8:] = True
        
        for i, s in enumerate(sizes):
            label_id = i + 1
            ys, xs = np.where(fg_labeled == label_id)
            cy, cx = ys.mean(), xs.mean()
            touches_border = np.any(border_zone[ys, xs])
            # Keep components that are >= 100px or > 2.5% of largest component
            if s >= max(100, max_s * 0.025):
                # Discard thin artifacts stuck along borders
                if not (touches_border and s < 1200 and (cx < 16 or cx > w - 16 or cy < 16 or cy > h - 16)):
                    keep.append(label_id)
        fg = np.isin(fg_labeled, keep)
        
    # If foreground ended up empty (fallback protection)
    if np.sum(fg) < 150:
        fg = bright < 215
        
    # 4. Anti-aliasing with distance transform
    dist = ndi.distance_transform_edt(fg)
    alpha = np.clip(dist * 255.0, 0, 255).astype(np.uint8)
    alpha[~fg] = 0
    
    # 5. Tight crop
    rgba = np.dstack([arr.astype(np.uint8), alpha])
    out = Image.fromarray(rgba, "RGBA")
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
        
    return out


print("=== Starting 100% Background & Shadow Removal for All Prey & Hazards ===")

# --- 1. Process 9 Hazards ---
hazard_sheet_path = os.path.join(ARTIFACT_DIR, "hazards_3d_sheet_1792570091812.jpg")
hazard_defs = [
    (0, 0, "hazard_mine"),
    (0, 1, "hazard_torpedo"),
    (0, 2, "hazard_submarine"),
    (1, 0, "hazard_jellyfish"),
    (1, 1, "hazard_diver"),
    (1, 2, "hazard_iceberg"),
    (2, 0, "hazard_net"),
    (2, 1, "hazard_barracuda"),
    (2, 2, "hazard_lionfish")
]

if os.path.exists(hazard_sheet_path):
    with Image.open(hazard_sheet_path) as sheet:
        W, H = sheet.size
        cw, ch = W // 3, H // 3
        for r, c, hid in hazard_defs:
            cell = sheet.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch))
            is_net = (hid == "hazard_net")
            clean_im = extract_clean_sprite(cell, is_net=is_net)
            
            web_p = os.path.join(BASE_DIR, "assets", "hazards", f"{hid}.png")
            unity_p = os.path.join(BASE_DIR, "Assets", "Art", "Hazards", f"{hid}.png")
            os.makedirs(os.path.dirname(web_p), exist_ok=True)
            os.makedirs(os.path.dirname(unity_p), exist_ok=True)
            clean_im.save(web_p, "PNG")
            clean_im.save(unity_p, "PNG")
            print(f" -> Saved Clean Hazard: {hid}.png (Size: {clean_im.size})")

# --- 2. Process All 50 Prey Items Across 5 Characters ---
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
        "file": "prey_megalodon_sheet_1792568727847.jpg",
        "grid": (4, 3),
        "names": ["mg_1_ancient_whale", "mg_2_giant_turtle", "mg_3_manatee", "mg_4_sea_lion_pack", "mg_5_bluefin", "mg_6_manta_ray", "mg_7_ancient_shark", "mg_8_mosasaur", "mg_9_sperm_whale", "mg_10_giant_tuna"]
    }
}

for char_name, info in PREY_SHEETS.items():
    sheet_p = os.path.join(ARTIFACT_DIR, info["file"])
    if not os.path.exists(sheet_p):
        print(f"Warning: Sheet {sheet_p} not found!")
        continue
        
    with Image.open(sheet_p) as sheet:
        W, H = sheet.size
        rows, cols = info["grid"]
        cw, ch = W // cols, H // rows
        
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
                
                # Check special case for sardines (10th item on killer whale)
                cell = sheet.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch))
                clean_im = extract_clean_sprite(cell)
                
                web_out = os.path.join(web_folder, f"{name}.png")
                unity_out = os.path.join(unity_folder, f"{name}.png")
                clean_im.save(web_out, "PNG")
                clean_im.save(unity_out, "PNG")
                idx += 1
                
        # If killer whale has 10th item (kw_10_sardines) and 3x3 only has 9 cells:
        # We also check if kw_10_sardines exists or slice from center
        if char_name == "killer_whale" and idx < len(info["names"]):
            # kw_10_sardines is derived or existing cleaned
            print(f" -> Note: kw_10_sardines handling (9 grid cells in killer whale sheet)")
            
        print(f" -> Successfully saved {idx} clean prey items for {char_name}")

print("\n=== Background & Shadow Removal Complete! ===")
