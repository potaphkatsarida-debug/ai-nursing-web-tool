export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    const { text } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: `
Βελτίωσε την παρακάτω νοσηλευτική λογοδοσία στα ελληνικά.
Να είναι επαγγελματική, σύντομη, σαφής και νοσηλευτικού ύφους.
Μην εφευρίσκεις δεδομένα.

Κείμενο:
${text}
        `,
      }),
    });

    const data = await response.json();

    console.log(data);

    const output =
      data.output?.[0]?.content?.[0]?.text ||
      "Δεν υπήρξε απάντηση από το AI.";

    return res.status(200).json({
      result: output,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Σφάλμα κατά την κλήση του AI agent.",
    });
  }
}
