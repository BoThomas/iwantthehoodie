/// <reference types="@cloudflare/workers-types" />

export default {
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    // Fetch the website content
    const url = env.ITEM_URL;
    const response = await fetch(url);

    let found = false;
    let isDisabled = false;

    // Use HTMLRewriter to parse the HTML and check for the element
    let buffer = "";
    const rewriter = new HTMLRewriter()
      .on(".heading.product-options-item", {
        text(textChunk) {
          buffer += textChunk.text;
        },
        element(element) {
          // After the text handler, check if the buffer is 'L'
          if (buffer.trim() === "L") {
            found = true;
            if (element.hasAttribute("class") && element.getAttribute("class")?.includes("disabled")) {
              isDisabled = true;
            }
          }
          buffer = ""; // Reset buffer for next element
        }
      });

    // HTMLRewriter requires a Response object
    await rewriter.transform(response).arrayBuffer();

    // Prepare the message
    let message = "";
    if (found && !isDisabled) {
      message = `Item found, its available ✅\n<a href=\"${url}\">go to item</a>`;
    } else if (found && isDisabled) {
      message = "Item found, but not available ❌";
    } else {
      message = "Item to monitor was not found 🚫";
    }

    // log for debugging in a single line
    console.log(`Time: ${new Date().toISOString()}, Found: ${found}, Disabled: ${isDisabled}, Message: ${message}`);

    // Decouple shouldSend logic
    let shouldSend = false;
    if (found && !isDisabled) {
      shouldSend = true;
    } else if (!found) {
      shouldSend = true;
    }

    if (shouldSend) {
      // Send to Telegram
      const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      const payload = {
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
        message_thread_id: Number(env.TELEGRAM_TOPIC_ID),
        parse_mode: "HTML"
      };
      await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
  },
};
