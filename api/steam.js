// Vercel serverless function: live Steam search + PC requirements.
//   /api/steam?q=elden        -> search results
//   /api/steam?id=1245620     -> game + parsed requirements
const UA = { headers: { "User-Agent": "Mozilla/5.0 RunMyGame" } };

const strip = h => String(h || "")
    .replace(/<br\s*\/?>|<\/li>|<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#?\w+;/g, "")
    .replace(/[ \t]+/g, " ");

const line = (t, re) => { const m = t.match(re); return m ? m[1].trim() : ""; };
const gb = (n, unit) => Number((/mb/i.test(unit) ? n / 1024 : n).toFixed(1));

function parseReq(html) {
    if (!html) return null;
    const t = strip(html);
    const cpu = line(t, /^\s*(?:Processor|CPU)\s*:\s*(.+)$/im);
    const gpu = line(t, /^\s*(?:Graphics|Video Card|GPU|Video)\s*:\s*(.+)$/im);
    const mem = line(t, /^\s*(?:Memory|RAM)\s*:\s*(.+)$/im);
    if (!cpu && !gpu) return null;
    const rm = mem.match(/(\d+(?:\.\d+)?)\s*(GB|MB)/i);
    const vm = gpu.match(/(\d+(?:\.\d+)?)\s*(GB|MB)\s*(?:of\s*)?(?:dedicated\s*)?(?:VRAM|video)/i)
        || gpu.match(/VRAM\s*:?\s*(\d+(?:\.\d+)?)\s*(GB|MB)/i);
    return { cpu, gpu, ram: rm ? gb(+rm[1], rm[2]) : undefined, vram: vm ? gb(+vm[1], vm[2]) : undefined };
}

module.exports = async (req, res) => {
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    try {
        const { q, id } = req.query;
        if (q) {
            const r = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&l=english&cc=us`, UA);
            const d = await r.json();
            const items = (d.items || []).filter(i => i.type === "app").slice(0, 8)
                .map(i => ({ id: i.id, name: i.name, image: i.tiny_image }));
            return res.status(200).json({ items });
        }
        if (id && /^\d+$/.test(id)) {
            const r = await fetch(`https://store.steampowered.com/api/appdetails?appids=${id}&l=english&cc=us`, UA);
            const d = (await r.json())[id];
            if (!d || !d.success) return res.status(404).json({ error: "not found" });
            const g = d.data, pc = g.pc_requirements || {};
            const minimum = parseReq(pc.minimum), recommended = parseReq(pc.recommended);
            if (!minimum && !recommended) return res.status(404).json({ error: "no requirements" });
            const year = ((g.release_date || {}).date || "").match(/\d{4}/);
            return res.status(200).json({
                id: +id, name: g.name, year: year ? +year[0] : "",
                genre: (g.genres && g.genres[0] && g.genres[0].description) || "PC Game",
                image: g.header_image, minimum: minimum || recommended, recommended, source: "steam"
            });
        }
        res.status(400).json({ error: "use ?q= or ?id=" });
    } catch (e) {
        res.status(502).json({ error: "steam unavailable" });
    }
};
