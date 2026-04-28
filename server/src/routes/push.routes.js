import { Router } from "express";
import PushSubscription from "../models/PushSubscription.js";

const router = Router();

function getPublicVapidKey() {
  return process.env.VAPID_PUBLIC_KEY || "";
}

function isValidSubscription(subscription) {
  return Boolean(
    subscription?.endpoint &&
      subscription?.keys?.p256dh &&
      subscription?.keys?.auth
  );
}

router.get("/vapid-public-key", (req, res) => {
  const publicKey = getPublicVapidKey();

  if (!publicKey) {
    return res.status(503).json({ error: "Push notifications are not configured" });
  }

  res.json({ publicKey });
});

router.post("/subscribe", async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!isValidSubscription(subscription)) {
      return res.status(400).json({ error: "Invalid push subscription" });
    }

    const savedSubscription = await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        userId: req.userId,
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        userAgent: req.get("user-agent") || "",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ id: savedSubscription._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save push subscription" });
  }
});

router.delete("/unsubscribe", async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ error: "Subscription endpoint is required" });
    }

    await PushSubscription.deleteOne({ userId: req.userId, endpoint });

    res.json({ message: "Push subscription removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove push subscription" });
  }
});

export default router;
