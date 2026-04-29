// equipment.js - Полная библиотека оборудования для кинопроизводства
const equipmentLibrary = {
    cameras: [
        // ARRI
        { id: "arri_a35", name: "ARRI Alexa 35", type: "Кино", sensor: "Super 35", resolution: "4.6K", mount: "LPL/PL" },
        { id: "arri_mini_lf", name: "ARRI Alexa Mini LF", type: "Кино", sensor: "Full Frame", resolution: "4.5K", mount: "LPL/PL" },
        { id: "arri_mini", name: "ARRI Alexa Mini", type: "Кино", sensor: "Super 35", resolution: "3.4K", mount: "PL" },
        { id: "arri_amira", name: "ARRI Amira", type: "Кино", sensor: "Super 35", resolution: "HD/4K", mount: "PL" },
        { id: "arri_65", name: "ARRI Alexa 65", type: "Кино", sensor: "Large Format", resolution: "6.5K", mount: "PL" },
        // RED
        { id: "red_vraptor_vv", name: "RED V-RAPTOR 8K VV", type: "Кино", sensor: "Full Frame", resolution: "8K", mount: "RF/PL" },
        { id: "red_vraptor_xl", name: "RED V-RAPTOR XL 8K", type: "Кино", sensor: "Full Frame", resolution: "8K", mount: "RF/PL" },
        { id: "red_komodo", name: "RED Komodo 6K", type: "Кино", sensor: "Super 35", resolution: "6K", mount: "RF/PL" },
        { id: "red_monstro", name: "RED MONSTRO 8K VV", type: "Кино", sensor: "Full Frame", resolution: "8K", mount: "PL" },
        { id: "red_gemini", name: "RED Gemini 5K", type: "Кино", sensor: "Super 35", resolution: "5K", mount: "PL" },
        // Sony
        { id: "sony_venice2", name: "Sony VENICE 2 8.6K", type: "Кино", sensor: "Full Frame", resolution: "8.6K", mount: "E/PL" },
        { id: "sony_venice", name: "Sony VENICE 6K", type: "Кино", sensor: "Full Frame", resolution: "6K", mount: "E/PL" },
        { id: "sony_fx9", name: "Sony FX9", type: "Кино", sensor: "Full Frame", resolution: "6K", mount: "E" },
        { id: "sony_fx6", name: "Sony FX6", type: "Кино", sensor: "Full Frame", resolution: "4K", mount: "E" },
        { id: "sony_fx3", name: "Sony FX3", type: "Кино", sensor: "Full Frame", resolution: "4K", mount: "E" },
        { id: "sony_fx30", name: "Sony FX30", type: "Кино", sensor: "Super 35", resolution: "6K", mount: "E" },
        { id: "sony_a7s3", name: "Sony A7S III", type: "Полупроф", sensor: "Full Frame", resolution: "4K", mount: "E" },
        { id: "sony_a1", name: "Sony A1", type: "Полупроф", sensor: "Full Frame", resolution: "8K", mount: "E" },
        // Canon
        { id: "canon_c500mk2", name: "Canon EOS C500 Mark II", type: "Кино", sensor: "Full Frame", resolution: "5.9K", mount: "EF/PL" },
        { id: "canon_c300mk3", name: "Canon EOS C300 Mark III", type: "Кино", sensor: "Super 35", resolution: "4K", mount: "EF/PL" },
        { id: "canon_c70", name: "Canon EOS C70", type: "Кино", sensor: "Super 35", resolution: "4K", mount: "RF" },
        { id: "canon_r5c", name: "Canon EOS R5 C", type: "Полупроф", sensor: "Full Frame", resolution: "8K", mount: "RF" },
        // Blackmagic
        { id: "bm_ursa12k", name: "Blackmagic URSA Mini Pro 12K", type: "Кино", sensor: "Super 35", resolution: "12K", mount: "EF/PL" },
        { id: "bm_ursa_g2", name: "Blackmagic URSA Mini Pro 4.6K G2", type: "Кино", sensor: "Super 35", resolution: "4.6K", mount: "EF/PL" },
        { id: "bm_pocket6kpro", name: "Blackmagic Pocket Cinema 6K Pro", type: "Кино", sensor: "Super 35", resolution: "6K", mount: "EF" },
        { id: "bm_pocket4k", name: "Blackmagic Pocket Cinema 4K", type: "Кино", sensor: "MFT", resolution: "4K", mount: "MFT" },
        // Panasonic
        { id: "pana_eva1", name: "Panasonic AU-EVA1", type: "Кино", sensor: "Super 35", resolution: "5.7K", mount: "EF" },
        { id: "pana_gh6", name: "Panasonic GH6", type: "Полупроф", sensor: "MFT", resolution: "5.7K", mount: "MFT" },
        { id: "pana_s1h", name: "Panasonic S1H", type: "Полупроф", sensor: "Full Frame", resolution: "6K", mount: "L" },
        // Z CAM
        { id: "zcam_f6", name: "Z CAM E2-F6", type: "Кино", sensor: "Full Frame", resolution: "6K", mount: "EF/PL" },
        { id: "zcam_s6", name: "Z CAM E2-S6", type: "Кино", sensor: "Super 35", resolution: "6K", mount: "EF/PL" },
        // Kinefinity
        { id: "kine_mavo_edge", name: "Kinefinity MAVO Edge 8K", type: "Кино", sensor: "Full Frame", resolution: "8K", mount: "PL" },
        { id: "kine_mavo_lf", name: "Kinefinity MAVO LF", type: "Кино", sensor: "Full Frame", resolution: "6K", mount: "PL" },
        // DJI
        { id: "dji_ronin4d", name: "DJI Ronin 4D", type: "Кино", sensor: "Full Frame", resolution: "6K", mount: "DL/E" },
        { id: "dji_inspire3", name: "DJI Inspire 3", type: "Дрон", sensor: "Full Frame", resolution: "8K", mount: "DL" },
        // FUJIFILM
        { id: "fuji_xh2s", name: "FUJIFILM X-H2S", type: "Полупроф", sensor: "APS-C", resolution: "6K", mount: "X" },
        // Nikon
        { id: "nikon_z9", name: "Nikon Z9", type: "Проф", sensor: "Full Frame", resolution: "8K", mount: "Z" },
        { id: "nikon_z8", name: "Nikon Z8", type: "Проф", sensor: "Full Frame", resolution: "8K", mount: "Z" },
        // Leica
        { id: "leica_sl3", name: "Leica SL3", type: "Проф", sensor: "Full Frame", resolution: "6K", mount: "L" },
        // GoPro
        { id: "gopro_hero12", name: "GoPro Hero 12 Black", type: "Экшн", sensor: "1/1.9\"", resolution: "5.3K", mount: "Fixed" }
    ],
    lenses: [
        // ARRI Signature
        { id: "lens_arri25", name: "ARRI Signature Prime 25mm T1.5", mount: "LPL", focal_length: "25mm", aperture: "T1.5" },
        { id: "lens_arri35", name: "ARRI Signature Prime 35mm T1.5", mount: "LPL", focal_length: "35mm", aperture: "T1.5" },
        { id: "lens_arri50", name: "ARRI Signature Prime 50mm T1.5", mount: "LPL", focal_length: "50mm", aperture: "T1.5" },
        { id: "lens_arri75", name: "ARRI Signature Prime 75mm T1.5", mount: "LPL", focal_length: "75mm", aperture: "T1.5" },
        // Zeiss Supreme
        { id: "lens_zeiss25", name: "Zeiss Supreme Prime 25mm T1.5", mount: "PL", focal_length: "25mm", aperture: "T1.5" },
        { id: "lens_zeiss35", name: "Zeiss Supreme Prime 35mm T1.5", mount: "PL", focal_length: "35mm", aperture: "T1.5" },
        { id: "lens_zeiss50", name: "Zeiss Supreme Prime 50mm T1.5", mount: "PL", focal_length: "50mm", aperture: "T1.5" },
        { id: "lens_zeiss85", name: "Zeiss Supreme Prime 85mm T1.5", mount: "PL", focal_length: "85mm", aperture: "T1.5" },
        // Sony GM
        { id: "lens_sony2470", name: "Sony FE 24-70mm f/2.8 GM II", mount: "E", focal_length: "24-70mm", aperture: "f/2.8" },
        { id: "lens_sony70200", name: "Sony FE 70-200mm f/2.8 GM OSS II", mount: "E", focal_length: "70-200mm", aperture: "f/2.8" },
        { id: "lens_sony50", name: "Sony FE 50mm f/1.2 GM", mount: "E", focal_length: "50mm", aperture: "f/1.2" },
        // Canon RF
        { id: "lens_canon2470", name: "Canon RF 24-70mm f/2.8 L IS USM", mount: "RF", focal_length: "24-70mm", aperture: "f/2.8" },
        { id: "lens_canon70200", name: "Canon RF 70-200mm f/2.8 L IS USM", mount: "RF", focal_length: "70-200mm", aperture: "f/2.8" },
        { id: "lens_canon50", name: "Canon RF 50mm f/1.2 L USM", mount: "RF", focal_length: "50mm", aperture: "f/1.2" },
        // Nikon Z
        { id: "lens_nikon2470", name: "Nikon NIKKOR Z 24-70mm f/2.8 S", mount: "Z", focal_length: "24-70mm", aperture: "f/2.8" },
        // FUJIFILM X
        { id: "lens_fuji1855", name: "FUJINON XF 18-55mm f/2.8-4 R LM OIS", mount: "X", focal_length: "18-55mm", aperture: "f/2.8-4" },
        // MFT
        { id: "lens_oly1240", name: "Olympus M.Zuiko 12-40mm f/2.8 Pro", mount: "MFT", focal_length: "12-40mm", aperture: "f/2.8" }
    ],
    recorders: [
        { id: "atomos_ninjav", name: "Atomos Ninja V+", type: "Монитор-рекордер", resolution: "8K", features: "ProRes RAW" },
        { id: "atomos_shogun7", name: "Atomos Shogun 7", type: "Монитор-рекордер", resolution: "4K", features: "HDR" },
        { id: "bm_videoassist5", name: "Blackmagic Video Assist 5\" 12G", type: "Монитор-рекордер", resolution: "4K", features: "BRAW" },
        { id: "bm_videoassist7", name: "Blackmagic Video Assist 7\" 12G", type: "Монитор-рекордер", resolution: "4K", features: "BRAW" },
        { id: "smallhd_cine7", name: "SmallHD Cine 7", type: "Монитор", resolution: "4K", features: "Wireless" }
    ],
    stabilization: [
        { id: "dji_rs4pro", name: "DJI RS 4 Pro", type: "Gimbal", payload: "4.5kg", features: "LiDAR" },
        { id: "dji_rs3pro", name: "DJI RS 3 Pro", type: "Gimbal", payload: "4.5kg", features: "LiDAR" },
        { id: "zh_crane4", name: "Zhiyun Crane 4", type: "Gimbal", payload: "4.5kg", features: "Sling Mode" },
        { id: "easyrig_5", name: "Easyrig 5", type: "Body Support", payload: "15kg" },
        { id: "steadicam_m1", name: "Steadicam M-1", type: "Vest", payload: "30kg" }
    ]
};