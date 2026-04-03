# Lab 61

This lab checks whether the stripped Android HTTP seam changes when the page is loaded through `WebViewAssetLoader` instead of `file:///android_asset/...`.

## Why this lab exists

The current picture is:

- `lab50`: in a file-loaded stripped shape, `10.0.2.2 + localhost` breaks both targets
- Android documentation recommends:
  - `WebViewAssetLoader`
  - `https://appassets.androidplatform.net/...`
  instead of `file://` for local content

So the next question is:

- does the `localhost` poisoning seam still appear if the host switches to the more official Android local-content shape

## Shape

This lab reuses the stripped Android host and two-target case list from `lab50`.

The only intentional host-side change is:

- `file:///android_asset/...`
  becomes
- `WebViewAssetLoader` + `https://appassets.androidplatform.net/assets/...`

## Result

- Android:
  - `{"status":"fail","detail":"[{\"id\":\"emulator_host\",\"error\":\"Failed to fetch\"},{\"id\":\"localhost_name\",\"error\":\"Failed to fetch\"}]"}`

## Conclusion

This seam survives the switch away from `file://`.

So `lab61` narrows the question again:

- the earlier Android stripped seam is **not** just a `file:///android_asset/...` artifact
- even under:
  - `WebViewAssetLoader`
  - `https://appassets.androidplatform.net/assets/...`
  the two-target shape:
  - `10.0.2.2`
  - `localhost`
  still fails on both targets

This means the next formal Android adapter upgrade may still be worth doing, but:

- `WebViewAssetLoader` alone does not erase the `localhost` poisoning seam
