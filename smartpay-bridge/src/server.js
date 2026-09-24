const http = require("http");
const { handleCin7Request } = require("./cin7");

const port = Number(process.env.PORT || 8787);

const server = http.createServer(async (req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      ok: true,
      service: "bss-cin7-smartpay-bridge",
      mode: process.env.BRIDGE_MODE || "mock"
    }));
  }

  try {
    const result = await handleCin7Request(req);
    res.writeHead(result.status || 200);
    res.end(JSON.stringify(result.body));
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({
      ok: false,
      error: "bridge_error",
      message: err && err.message ? err.message : "Unknown bridge error"
    }));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Cin7 Smartpay bridge listening on http://127.0.0.1:${port}`);
});
