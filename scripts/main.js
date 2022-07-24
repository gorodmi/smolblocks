const size = 1;
const aspect = {};

function processRegion(r, s) {
	if (r instanceof TextureRegion && r != null) {
		if (aspect[r] == null) aspect[r] = r.height / s;
        r.width = r.height = aspect[r] * size;
    };
}

function processDrawer(d, s) {
	if (d != null) {
        for (let key in d) {
            processRegion(d[key], s)
        }

        if (d.drawers != null) {
            d.drawers.forEach((dd) => {
                processDrawer(dd, s);
            })
        }
    };
}

Events.on(ClientLoadEvent, (e) => {
	Vars.content.blocks().each(b => {
		if (b == Blocks.buildTower || b == Blocks.constructor) return;
		if (b.buildVisibility === BuildVisibility.hidden) return;
		const lastSize = b.size;
		for (let key in b) processRegion(b[key], lastSize);
		for (let k in b.teamRegions) processRegion(b.teamRegions[k], lastSize);
		for (let k in b.variantRegions) processRegion(b.variantRegions[k], lastSize);
		processDrawer(b.drawer, lastSize);
		b.size = size;
		b.stats = new Stats();
		b.init();
	})
});