# Lab 64

This lab checks whether `WKContentWorld` gives the host a cleaner isolation boundary for injected test harness code.

## Why this lab exists

Apple's `WKContentWorld` suggests that:

- page JS
- host-injected helper JS
- message handlers

do not all need to share one JS world.

So the next question is:

- can the host inject helper code into a separate world
- while keeping the page world unpolluted

## Shape

This lab uses one inline page and one host-injected helper script.

Normal mode:

- page script runs in `.page`
- helper script runs in a named `WKContentWorld`

Fault mode:

- helper script is intentionally injected into `.page`

## Result

- iOS normal:
  - `{"status":"ok","detail":"page=pageValue:string|helperInjected:undefined; helper=pageValue:undefined|helperInjected:string"}`
- iOS fault:
  - `{"status":"fail","detail":"page=pageValue:string|helperInjected:string; helper=pageValue:string|helperInjected:string"}`

## Conclusion

`WKContentWorld` is a practical isolation primitive for a future formal iOS adapter.

This lab shows:

- the page world can keep seeing:
  - `pageValue`
  - but **not** host helper globals
- the named helper world can run host-injected harness code
  - without seeing page globals
- if the helper is intentionally injected back into `.page`
  - the pollution becomes visible and is detectable

So this is not just a theoretical API:

- it gives the host a real way to isolate injected test harness code from app page code
