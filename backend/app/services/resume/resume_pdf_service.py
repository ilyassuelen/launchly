from playwright.async_api import async_playwright

from backend.app.core.config import settings


async def generate_resume_pdf(resume_id: int, access_token: str) -> bytes:
    print_url = f"{settings.FRONTEND_URL}/resume-print/{resume_id}?token={access_token}"

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox"],
        )

        try:
            page = await browser.new_page(
                viewport={"width": 794, "height": 1200},
                device_scale_factor=1,
            )

            await page.goto(print_url, wait_until="networkidle")
            await page.wait_for_selector("#resume-print-root", timeout=15000)

            dimensions = await page.evaluate(
                """
                () => {
                  const el = document.querySelector("#resume-print-root");

                  return {
                    width: Math.ceil(el.scrollWidth),
                    height: Math.ceil(el.scrollHeight)
                  };
                }
                """
            )

            return await page.pdf(
                print_background=True,
                width=f"{dimensions['width']}px",
                height=f"{dimensions['height']}px",
                margin={
                    "top": "0px",
                    "right": "0px",
                    "bottom": "0px",
                    "left": "0px",
                },
                page_ranges="1",
            )

        finally:
            await browser.close()
