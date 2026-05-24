import express from "express";
import { chromium } from "playwright";

const app = express();

app.get("/mf", async (req, res) => {

  const id = req.query.id;

  if (!id) {
    return res.json({
      error: "missing id"
    });
  }

  const url =
    `https://www.mediafire.com/file/${id}/file`;

  const browser =
    await chromium.launch({

      headless: true

    });

  const page =
    await browser.newPage({

      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137 Safari/537.36"

    });

  try {

    await page.goto(url, {

      waitUntil: "networkidle",
      timeout: 60000

    });

    // ESPERA BOTÃO
    await page.waitForSelector(
      "#downloadButton",
      { timeout: 15000 }
    );

    // PEGA LINK
    const link =
      await page.$eval(
        "#downloadButton",
        el => el.href
      );

    await browser.close();

    return res.json({

      success: true,
      url: link

    });

  } catch (e) {

    await browser.close();

    return res.json({

      success: false,
      error: e.message

    });

  }

});

app.listen(3000, () => {

  console.log(
    "Server running"
  );

});