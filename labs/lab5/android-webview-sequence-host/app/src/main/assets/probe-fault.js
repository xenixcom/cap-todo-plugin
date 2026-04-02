window.addEventListener("load", async () => {
  window.AndroidProbe.onResult("boot");
  await new Promise((resolve) => setTimeout(resolve, 60));
  window.AndroidProbe.onResult("ready");
  await new Promise((resolve) => setTimeout(resolve, 60));
  window.AndroidProbe.onResult("result:-1");
  await new Promise((resolve) => setTimeout(resolve, 30));
  window.AndroidProbe.onResult("done");
});
