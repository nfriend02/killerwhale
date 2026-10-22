import os
import glob
import numpy as np
import scipy.ndimage as ndi
from PIL import Image

ARTIFACT_DIR = r"C:\Users\HS Kim\.gemini\antigravity-ide\brain\589d6df1-59c1-49ee-85f0-a1e21f686dce"
BASE_DIR = r"c:\Users\HS Kim\Desktop\Agames\killerwhale"

def get_grid_ranges(arr):
    # Detect Y cells (horizontal white gutters with brightness > 245)
    row_bright = np.mean(arr, axis=(1, 2))
    gaps_y = np.where(row_bright > 242)[0]
    split_y = np.where(np.diff(gaps_y) > 12)[0]
    y_clusters = []
    start = gaps_y[0]
    for idx in split_y:
        y_clusters.append((start, gaps_y[idx]))
        start = gaps_y[idx+1]
    y_clusters.append((start, gaps_y[-1]))
    y_ranges = [(y_clusters[i][1] + 2, y_clusters[i+1][0] - 2) for i in range(len(y_clusters)-1)]
    
    # Detect X cells (vertical white gutters with brightness > 245)
    col_bright = np.mean(arr, axis=(0, 2))
    gaps_x = np.where(col_bright > 242)[0]
    split_x = np.where(np.diff(gaps_x) > 12)[0]
    x_clusters = []
    start = gaps_x[0]
    for idx in split_x:
        x_clusters.append((start, gaps_x[idx]))
        start = gaps_x[idx+1]
    x_clusters.append((start, gaps_x[-1]))
    x_ranges = [(x_clusters[i][1] + 2, x_clusters[i+1][0] - 2) for i in range(len(x_clusters)-1)]
    
    return y_ranges, x_ranges


def clean_extract_cell(cell_img, is_net=False):
    arr = np.array(cell_img.convert("RGB"), dtype=np.float32)
    h, w, _ = arr.shape
    bright = np.mean(arr, axis=2)
    sat = np.max(arr, axis=2) - np.min(arr, axis=2)
    
    # Background and shadow candidate:
    # 1. Light/white: bright >= 195
    # 2. Card borders / gray drop shadows: bright >= 115 and sat < 65
    is_bg_candidate = (bright >= 195) | ((bright >= 115) & (sat < 65))
    
    # Seeds along all 4 outer borders of the cell
    seeds = np.zeros((h, w), dtype=bool)
    seeds[0:6, :] = True
    seeds[-6:, :] = True
    seeds[:, 0:6] = True
    seeds[:, -6:] = True
    seeds = seeds & is_bg_candidate
    
    labeled, num = ndi.label(is_bg_candidate)
    seed_labels = set(np.unique(labeled[seeds])) - {0}
    is_outer_bg = np.isin(labeled, list(seed_labels))
    fg = ~is_outer_bg
    
    # If it's the net, clear pure white interior holes
    if is_net:
        fg = fg & (bright < 210)
        
    # Remove floating edge noise or tiny artifacts
    fg_labeled, fg_num = ndi.label(fg)
    if fg_num > 0:
        sizes = ndi.sum(fg, fg_labeled, range(1, fg_num + 1))
        max_s = np.max(sizes)
        border_zone = np.zeros((h, w), dtype=bool)
        border_zone[0:8, :] = True
        border_zone[-8:, :] = True
        border_zone[:, 0:8] = True
        border_zone[:, -8:] = True
        
        keep = []
        for i, s in enumerate(sizes):
            label_id = i + 1
            ys, xs = np.where(fg_labeled == label_id)
            cy, cx = ys.mean(), xs.mean()
            touches_border = np.any(border_zone[ys, xs])
            if s >= max(100, max_s * 0.025):
                if not (touches_border and s < 1200 and (cx < 16 or cx > w - 16 or cy < 16 or cy > h - 16)):
                    keep.append(label_id)
        fg = np.isin(fg_labeled, keep)
        
    if np.sum(fg) < 150:
        fg = bright < 215
        
    # Distance transform for smooth anti-aliased edge
    dist = ndi.distance_transform_edt(fg)
    alpha = np.clip(dist * 255.0, 0, 255).astype(np.uint8)
    alpha[~fg] = 0
    
    # Tight bounding box crop
    rgba = np.dstack([arr.astype(np.uint8), alpha])
    out = Image.fromarray(rgba, "RGBA")
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
        
    return out


print("=== Processing All Assets with Gutter Channel Slicing ===")

# 1. Hazards
h_sheet_path = os.path.join(ARTIFACT_DIR, "hazards_3d_sheet_1792570091812.jpg")
with Image.open(h_sheet_path) as sheet:
    arr = np.array(sheet.convert("RGB"))
    y_r, x_r = get_grid_ranges(arr)
    hazard_names = [
        "hazard_mine", "hazard_torpedo", "hazard_submarine",
        "hazard_jellyfish", "hazard_diver", "hazard_iceberg",
        "hazard_net", "hazard_barracuda", "hazard_lionfish"
    ]
    idx = 0
    for r, (y0, y1) in enumerate(y_r):
        for c, (x0, x1) in enumerate(x_r):
            if idx >= len(hazard_names): break
            hid = hazard_names[idx]
            cell = sheet.crop((x0, y0, x1, y1))
            is_net = (hid == "hazard_net")
            clean_im = clean_extract_cell(cell, is_net=is_net)
            
            web_p = os.path.join(BASE_DIR, "assets", "hazards", f"{hid}.png")
            unity_p = os.path.join(BASE_DIR, "Assets", "Art", "Hazards", f"{hid}.png")
            os.makedirs(os.path.dirname(web_p), exist_ok=True)
            os.makedirs(os.path.dirname(unity_p), exist_ok=True)
            clean_im.save(web_p, "PNG")
            clean_im.save(unity_p, "PNG")
            print(f" -> Hazard: {hid}.png (Size: {clean_im.size})")
            idx += 1

# 2. Prey sheets
SHEETS_CONFIG = {
    "killer_whale": {
        "file": "prey_killer_whale_sheet_1792568620298.jpg",
        "names": ["kw_1_seal", "kw_2_salmon", "kw_3_fur_seal", "kw_4_penguin", "kw_5_herring", "kw_6_stingray", "kw_7_sea_lion", "kw_8_squid", "kw_9_elephant_seal"]
    },
    "shark": {
        "file": "prey_shark_sheet_1792568646022.jpg",
        "names": ["sk_1_tuna", "sk_2_mackerel", "sk_3_turtle", "sk_4_sardine", "sk_5_yellowtail", "sk_6_saury", "sk_7_spanish_mackerel", "sk_8_flying_fish", "sk_9_crab", "sk_10_filefish"]
    },
    "blue_marlin": {
        "file": "prey_marlin_sheet_1792568673316.jpg",
        "names": ["bm_1_reef_squid", "bm_2_mahimahi", "bm_3_flying_fish", "bm_4_anchovy", "bm_5_spanish_mackerel", "bm_6_mackerel", "bm_7_horse_mackerel", "bm_8_young_marlin", "bm_9_saury"]
    },
    "giant_squid": {
        "file": "prey_squid_sheet_1792568699285.jpg",
        "names": ["gs_1_anglerfish", "gs_2_lanternfish", "gs_3_shrimp", "gs_4_worm", "gs_5_cuttlefish", "gs_6_pollock", "gs_7_cod", "gs_8_crab", "gs_9_ammonite", "gs_10_krill"]
    },
    "megalodon": {
        "file": "prey_megalodon_sheet_1792568727847.jpg",
        "names": ["mg_1_ancient_whale", "mg_2_giant_turtle", "mg_3_manatee", "mg_4_sea_lion_pack", "mg_5_bluefin", "mg_6_manta_ray", "mg_7_ancient_shark", "mg_8_mosasaur", "mg_9_sperm_whale", "mg_10_giant_tuna"]
    }
}

for char_name, conf in SHEETS_CONFIG.items():
    sp = os.path.join(ARTIFACT_DIR, conf["file"])
    with Image.open(sp) as sheet:
        arr = np.array(sheet.convert("RGB"))
        y_r, x_r = get_grid_ranges(arr)
        names = conf["names"]
        web_folder = os.path.join(BASE_DIR, "assets", "prey", char_name)
        unity_folder = os.path.join(BASE_DIR, "Assets", "Art", "Prey", char_name)
        os.makedirs(web_folder, exist_ok=True)
        os.makedirs(unity_folder, exist_ok=True)
        
        idx = 0
        for r, (y0, y1) in enumerate(y_r):
            for c, (x0, x1) in enumerate(x_r):
                if idx >= len(names): break
                name = names[idx]
                cell = sheet.crop((x0, y0, x1, y1))
                clean_im = clean_extract_cell(cell)
                
                web_out = os.path.join(web_folder, f"{name}.png")
                unity_out = os.path.join(unity_folder, f"{name}.png")
                clean_im.save(web_out, "PNG")
                clean_im.save(unity_out, "PNG")
                idx += 1
                
        # If blue_marlin has 10th item bm_10_seabird:
        if char_name == "blue_marlin":
            # Clean up bm_10_seabird using clean_extract_cell on its existing image
            bm10_path = os.path.join(web_folder, "bm_10_seabird.png")
            if os.path.exists(bm10_path):
                with Image.open(bm10_path) as im:
                    clean_bm10 = clean_extract_cell(im)
                    clean_bm10.save(bm10_path, "PNG")
                    clean_bm10.save(os.path.join(unity_folder, "bm_10_seabird.png"), "PNG")
            print(f" -> Blue marlin 10 items processed (including bm_10_seabird)")
            
        # If killer_whale has 10th item kw_10_sardines:
        if char_name == "killer_whale":
            kw10_path = os.path.join(web_folder, "kw_10_sardines.png")
            if os.path.exists(kw10_path):
                with Image.open(kw10_path) as im:
                    clean_kw10 = clean_extract_cell(im)
                    clean_kw10.save(kw10_path, "PNG")
                    clean_kw10.save(os.path.join(unity_folder, "kw_10_sardines.png"), "PNG")
            print(f" -> Killer whale 10 items processed (including kw_10_sardines)")

print("=== All 50 Prey Items & 9 Hazards Perfectly Sliced and Cleaned! ===")
