# Lab 62

This lab checks whether Android's stripped seam behaves differently when the bridge is upgraded from `addJavascriptInterface` to `addWebMessageListener`.

## Why this lab exists

After `lab61`, the remaining question is no longer about `file://`.

The current picture is:

- `lab61`: `WebViewAssetLoader` does not erase the `localhost` poisoning seam
- Android documentation now points to:
  - `WebViewCompat.addWebMessageListener`
  instead of relying on legacy `addJavascriptInterface`

So the next question is:

- does the stripped seam change when the message bridge itself is moved to the more formal Android route

## Shape

This lab reuses `lab61` exactly, except for one change:

- host bridge:
  - from `addJavascriptInterface`
  - to `WebViewCompat.addWebMessageListener`

The target list is unchanged:

- `10.0.2.2`
- `localhost`

## Result

- Android:
  - `{"status":"fail","detail":"[{\"id\":\"emulator_host\",\"error\":\"Failed to fetch\"},{\"id\":\"localhost_name\",\"error\":\"Failed to fetch\"}]"}`

## Conclusion

The message-bridge upgrade succeeds, but the seam survives it.

So `lab62` narrows the Android picture again:

- `addWebMessageListener` is viable in this host shape
- but the earlier stripped seam is **not** caused by legacy `addJavascriptInterface`
- even after moving to:
  - `WebViewAssetLoader`
  - `addWebMessageListener`
  the two-target shape:
  - `10.0.2.2`
  - `localhost`
  still fails on both targets

This means the remaining seam is deeper than:

- `file://` local loading
- legacy JS bridge choice
