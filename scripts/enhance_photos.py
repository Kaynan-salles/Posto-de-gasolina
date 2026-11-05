#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Aprimoramento Profissional de Imagens — Grupo Oliveira
Melhora nitidez, alcance dinâmico (sombras/altas luzes), contraste e vibração
preservando 100% da identidade arquitetônica e real das fotos das unidades de Parintins - AM.
"""

import os
import sys
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UNITS_DIR = os.path.join(BASE_DIR, 'assets', 'img', 'units')
os.makedirs(UNITS_DIR, exist_ok=True)

# Mapeamento oficial dos arquivos na raiz para os IDs canônicos das unidades
STATION_IMAGE_MAP = [
    {
        'id': 'posto-vilacristina',
        'key': 'posto_vilacristina',
        'search': 'cristina',
        'name': 'Posto Oliveira — Vila Cristina',
        'gamma': 0.94,      # Leve clareamento sob a cobertura
        'fine_sharp': 130,
        'mid_sharp': 40
    },
    {
        'id': 'posto-uniao',
        'key': 'posto_uniao',
        'search': 'uni',
        'name': 'Fábrica de Gelo e Posto União',
        'gamma': 0.96,
        'fine_sharp': 120,
        'mid_sharp': 35
    },
    {
        'id': 'posto-ponte',
        'key': 'posto_ponte',
        'search': 'ponte',
        'name': 'Posto Oliveira Ponte',
        'gamma': 0.95,
        'fine_sharp': 125,
        'mid_sharp': 35
    },
    {
        'id': 'posto-sham',
        'key': 'posto_sham',
        'search': 'sham',
        'name': 'Posto Oliveira Sham',
        'gamma': 0.95,
        'fine_sharp': 125,
        'mid_sharp': 35
    },
    {
        'id': 'posto-francesa',
        'key': 'posto_francesa',
        'search': 'francesa',
        'name': 'Posto Oliveira Francesa',
        'gamma': 0.93,      # Recupera sombras do cais / área fluvial
        'fine_sharp': 135,
        'mid_sharp': 45
    },
    {
        'id': 'posto-planetaboi',
        'key': 'posto_planetaboi',
        'search': 'planeta',
        'name': 'Posto Oliveira Planeta Boi',
        'gamma': 0.95,
        'fine_sharp': 125,
        'mid_sharp': 35
    },
    {
        'id': 'escritorio-central',
        'key': 'escritorio_central',
        'search': 'escrit',
        'name': 'Escritório Central Grupo Oliveira',
        'gamma': 0.95,
        'fine_sharp': 125,
        'mid_sharp': 35
    }
]

def find_source_file(search_term):
    for f in os.listdir(BASE_DIR):
        if f.lower().endswith(('.jpeg', '.jpg', '.png')) and search_term.lower() in f.lower():
            return os.path.join(BASE_DIR, f)
    return None

def adjust_gamma(img, gamma=1.0):
    """Ajuste de curva gama para revelar sombras sem queimar altas luzes."""
    if gamma == 1.0:
        return img
    inv_gamma = 1.0 / gamma
    lut = [int(((i / 255.0) ** inv_gamma) * 255.0) for i in range(256)]
    # Aplica em RGB (3 canais)
    if img.mode == 'RGB':
        return img.point(lut * 3)
    return img.point(lut)

def enhance_image(source_path, cfg):
    pil_img = Image.open(source_path).convert('RGB')

    # 1. Autocontraste suave nos limites de pico (preserva 99.6% dos tons originais)
    balanced = ImageOps.autocontrast(pil_img, cutoff=0.2)

    # 2. Revelação inteligente de sombras via curva gama suave
    gamma_val = cfg.get('gamma', 0.95)
    shadows_lifted = adjust_gamma(balanced, gamma=gamma_val)

    # 3. Nitidez multi-escala (Studio Clarity)
    # A) Frequências finas (textos, bombas, letreiros, placas)
    fine_percent = cfg.get('fine_sharp', 125)
    sharp_fine = shadows_lifted.filter(
        ImageFilter.UnsharpMask(radius=1.3, percent=fine_percent, threshold=2)
    )

    # B) Frequências médias (definição das estruturas, colunas e detalhes arquitetônicos)
    mid_percent = cfg.get('mid_sharp', 35)
    sharp_mid = sharp_fine.filter(
        ImageFilter.UnsharpMask(radius=3.2, percent=mid_percent, threshold=4)
    )

    # 4. Ajuste harmônico de vibração (realce de 9% para cores da marca ficarem vivas e naturais)
    vibrant = ImageEnhance.Color(sharp_mid).enhance(1.09)

    # 5. Micro-contraste fotográfico (3% para dar profundidade estética)
    contrast_tuned = ImageEnhance.Contrast(vibrant).enhance(1.04)

    return contrast_tuned

def process_all():
    print("[Studio Engine] Iniciando Aprimoramento Fotográfico Profissional...")
    results = []

    for item in STATION_IMAGE_MAP:
        src = find_source_file(item['search'])
        if not src:
            print(f"[!] Imagem não encontrada para {item['name']} (busca '{item['search']}')")
            continue

        orig_filename = os.path.basename(src)
        print(f"\n-> {item['name']}")
        print(f"   Origem: {orig_filename}")

        enhanced = enhance_image(src, item)

        # Salvar em JPEG de altíssima fidelidade (95)
        jpg_out = os.path.join(UNITS_DIR, f"{item['key']}.jpg")
        enhanced.save(jpg_out, 'JPEG', quality=95, optimize=True, progressive=True)

        # Salvar em WebP de altíssima eficiência (92, method=6)
        webp_out = os.path.join(UNITS_DIR, f"{item['key']}.webp")
        enhanced.save(webp_out, 'WEBP', quality=92, method=6)

        # Thumbnail responsivo (800x600) para cards
        thumb = enhanced.copy()
        thumb.thumbnail((800, 600), Image.Resampling.LANCZOS)
        thumb_out = os.path.join(UNITS_DIR, f"{item['key']}_thumb.webp")
        thumb.save(thumb_out, 'WEBP', quality=90, method=6)

        jpg_kb = os.path.getsize(jpg_out) / 1024
        webp_kb = os.path.getsize(webp_out) / 1024
        print(f"   Salvo: {os.path.basename(jpg_out)} ({jpg_kb:.1f} KB)")
        print(f"   Salvo: {os.path.basename(webp_out)} ({webp_kb:.1f} KB)")

        results.append({
            'id': item['id'],
            'name': item['name'],
            'jpg': f"assets/img/units/{item['key']}.jpg",
            'webp': f"assets/img/units/{item['key']}.webp",
            'thumb': f"assets/img/units/{item['key']}_thumb.webp"
        })

    print(f"\n[OK] Processamento concluido com sucesso para {len(results)} unidades!")
    return results

if __name__ == '__main__':
    process_all()
