# Fallback extractor: reads a Geofabrik OSM .pbf and writes skate park features
# (leisure=skatepark, or sport including skateboard) plus city/town/village nodes for park cities
# as GeoJSON lines (one per element, bbox-polygon geometry) for build-skateparks.mjs.
# Usage: python3 extract-skateparks-pbf.py ontario.osm.pbf out.geojsonseq   (pip install osmium)
import json, sys
import osmium

src, dst = sys.argv[1], sys.argv[2]
feats = []
fp = osmium.FileProcessor(src).with_filter(osmium.filter.KeyFilter('leisure', 'sport', 'place')).with_locations()
for o in fp:
    tags = {t.k: t.v for t in o.tags}
    is_place = o.is_node() and tags.get('place') in ('city', 'town', 'village')
    if not is_place and tags.get('leisure') != 'skatepark' and 'skateboard' not in tags.get('sport', '').split(';'):
        continue
    pts = []
    if o.is_node():
        pts = [(o.location.lon, o.location.lat)]
    elif o.is_way():
        pts = [(n.location.lon, n.location.lat) for n in o.nodes if n.location.valid()]
    if pts:
        feats.append({'type': 'Feature', 'geometry': {'type': 'MultiPoint', 'coordinates': pts}, 'properties': tags})
    elif o.is_relation():
        feats.append({'type': 'Feature', 'relation': o.id, 'geometry': None, 'properties': tags})
with open(dst, 'w') as f:
    for x in feats:
        if x['geometry']:
            f.write(json.dumps(x) + '\n')
print(f'{len(feats)} elements ({sum(1 for x in feats if not x["geometry"])} relations skipped)')
