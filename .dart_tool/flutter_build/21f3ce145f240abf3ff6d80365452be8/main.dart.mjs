// Returns whether the `js-string` built-in is supported.
function detectJsStringBuiltins() {
  let bytes = [
    0,   97,  115, 109, 1,   0,   0,  0,   1,   4,   1,   96,  0,
    0,   2,   23,  1,   14,  119, 97, 115, 109, 58,  106, 115, 45,
    115, 116, 114, 105, 110, 103, 4,  99,  97,  115, 116, 0,   0
  ];
  return WebAssembly.validate(
    new Uint8Array(bytes), {builtins: ['js-string']});
}

// Compiles a dart2wasm-generated main module from `source` which can then
// instantiatable via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = detectJsStringBuiltins()
      ? {builtins: ['js-string']} : {};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm modules from `bytes` which is then
// instantiatable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = detectJsStringBuiltins()
      ? {builtins: ['js-string']} : {};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export async function instantiate(modulePromise, importObjectPromise) {
  var moduleOrCompiledApp = await modulePromise;
  if (!(moduleOrCompiledApp instanceof CompiledApp)) {
    moduleOrCompiledApp = new CompiledApp(moduleOrCompiledApp);
  }
  const instantiatedApp = await moduleOrCompiledApp.instantiate(await importObjectPromise);
  return instantiatedApp.instantiatedModule;
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredWasm` is a JS function that takes a module name matching a
  //   wasm file produced by the dart2wasm compiler and returns the bytes to
  //   load the module. These bytes can be in either a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  async instantiate(additionalImports, {loadDeferredWasm} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + js;
    }

    // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
      const exports = dartInstance.exports;
      const read = exports.$listRead;
      const length = exports.$listLength(list);
      const array = new constructor(length);
      for (let i = 0; i < length; i++) {
        array[i] = read(list, i);
      }
      return array;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {

      _1: (x0,x1,x2) => x0.set(x1,x2),
      _2: (x0,x1,x2) => x0.set(x1,x2),
      _3: (x0,x1) => x0.transferFromImageBitmap(x1),
      _4: x0 => x0.arrayBuffer(),
      _5: (x0,x1) => x0.transferFromImageBitmap(x1),
      _6: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._6(f,arguments.length,x0) }),
      _7: x0 => new window.FinalizationRegistry(x0),
      _8: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      _9: (x0,x1) => x0.unregister(x1),
      _10: (x0,x1,x2) => x0.slice(x1,x2),
      _11: (x0,x1) => x0.decode(x1),
      _12: (x0,x1) => x0.segment(x1),
      _13: () => new TextDecoder(),
      _14: x0 => x0.buffer,
      _15: x0 => x0.wasmMemory,
      _16: () => globalThis.window._flutter_skwasmInstance,
      _17: x0 => x0.rasterStartMilliseconds,
      _18: x0 => x0.rasterEndMilliseconds,
      _19: x0 => x0.imageBitmaps,
      _192: x0 => x0.select(),
      _193: (x0,x1) => x0.append(x1),
      _194: x0 => x0.remove(),
      _197: x0 => x0.unlock(),
      _202: x0 => x0.getReader(),
      _211: x0 => new MutationObserver(x0),
      _220: (x0,x1) => new OffscreenCanvas(x0,x1),
      _222: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _223: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _226: x0 => new ResizeObserver(x0),
      _229: (x0,x1) => new Intl.Segmenter(x0,x1),
      _230: x0 => x0.next(),
      _231: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      _316: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._316(f,arguments.length,x0) }),
      _317: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._317(f,arguments.length,x0) }),
      _318: (x0,x1) => ({addView: x0,removeView: x1}),
      _319: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._319(f,arguments.length,x0) }),
      _320: f => finalizeWrapper(f, function() { return dartInstance.exports._320(f,arguments.length) }),
      _321: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      _322: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._322(f,arguments.length,x0) }),
      _323: x0 => ({runApp: x0}),
      _324: x0 => new Uint8Array(x0),
      _326: x0 => x0.preventDefault(),
      _327: x0 => x0.stopPropagation(),
      _328: (x0,x1) => x0.addListener(x1),
      _329: (x0,x1) => x0.removeListener(x1),
      _330: (x0,x1) => x0.prepend(x1),
      _331: x0 => x0.remove(),
      _332: x0 => x0.disconnect(),
      _333: (x0,x1) => x0.addListener(x1),
      _334: (x0,x1) => x0.removeListener(x1),
      _336: (x0,x1) => x0.append(x1),
      _337: x0 => x0.remove(),
      _338: x0 => x0.stopPropagation(),
      _342: x0 => x0.preventDefault(),
      _343: (x0,x1) => x0.append(x1),
      _344: x0 => x0.remove(),
      _345: x0 => x0.preventDefault(),
      _350: (x0,x1) => x0.removeChild(x1),
      _351: (x0,x1) => x0.appendChild(x1),
      _352: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _353: (x0,x1) => x0.appendChild(x1),
      _354: (x0,x1) => x0.transferFromImageBitmap(x1),
      _356: (x0,x1) => x0.append(x1),
      _357: (x0,x1) => x0.append(x1),
      _358: (x0,x1) => x0.append(x1),
      _359: x0 => x0.remove(),
      _360: x0 => x0.remove(),
      _361: x0 => x0.remove(),
      _362: (x0,x1) => x0.appendChild(x1),
      _363: (x0,x1) => x0.appendChild(x1),
      _364: x0 => x0.remove(),
      _365: (x0,x1) => x0.append(x1),
      _366: (x0,x1) => x0.append(x1),
      _367: x0 => x0.remove(),
      _368: (x0,x1) => x0.append(x1),
      _369: (x0,x1) => x0.append(x1),
      _370: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _371: (x0,x1) => x0.append(x1),
      _372: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _373: x0 => x0.remove(),
      _374: (x0,x1) => x0.append(x1),
      _375: x0 => x0.remove(),
      _376: (x0,x1) => x0.append(x1),
      _377: x0 => x0.remove(),
      _378: x0 => x0.remove(),
      _379: x0 => x0.getBoundingClientRect(),
      _380: x0 => x0.remove(),
      _393: (x0,x1) => x0.append(x1),
      _394: x0 => x0.remove(),
      _395: (x0,x1) => x0.append(x1),
      _396: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _397: x0 => x0.preventDefault(),
      _398: x0 => x0.preventDefault(),
      _399: x0 => x0.preventDefault(),
      _400: x0 => x0.preventDefault(),
      _401: (x0,x1) => x0.observe(x1),
      _402: x0 => x0.disconnect(),
      _403: (x0,x1) => x0.appendChild(x1),
      _404: (x0,x1) => x0.appendChild(x1),
      _405: (x0,x1) => x0.appendChild(x1),
      _406: (x0,x1) => x0.append(x1),
      _407: x0 => x0.remove(),
      _408: (x0,x1) => x0.append(x1),
      _410: (x0,x1) => x0.appendChild(x1),
      _411: (x0,x1) => x0.append(x1),
      _412: x0 => x0.remove(),
      _413: (x0,x1) => x0.append(x1),
      _414: x0 => x0.remove(),
      _415: x0 => x0.remove(),
      _416: () => new Array(),
      _417: (x0,x1) => x0.push(x1),
      _418: (x0,x1) => x0.appendChild(x1),
      _419: x0 => x0.remove(),
      _980: () => globalThis.window.flutterConfiguration,
      _981: x0 => x0.assetBase,
      _986: x0 => x0.debugShowSemanticsNodes,
      _987: x0 => x0.hostElement,
      _988: x0 => x0.multiViewEnabled,
      _989: x0 => x0.nonce,
      _990: x0 => x0.renderer,
      _991: x0 => x0.fontFallbackBaseUrl,
      _993: () => globalThis.window.flutterWebRenderer,
      _996: x0 => x0.console,
      _997: x0 => x0.devicePixelRatio,
      _998: x0 => x0.document,
      _999: x0 => x0.history,
      _1000: x0 => x0.innerHeight,
      _1001: x0 => x0.innerWidth,
      _1002: x0 => x0.location,
      _1003: x0 => x0.navigator,
      _1004: x0 => x0.visualViewport,
      _1005: x0 => x0.performance,
      _1008: (x0,x1) => x0.dispatchEvent(x1),
      _1009: (x0,x1) => x0.matchMedia(x1),
      _1011: (x0,x1) => x0.getComputedStyle(x1),
      _1012: x0 => x0.screen,
      _1013: (x0,x1) => x0.requestAnimationFrame(x1),
      _1014: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1014(f,arguments.length,x0) }),
      _1018: (x0,x1) => x0.warn(x1),
      _1021: () => globalThis.window,
      _1022: () => globalThis.Intl,
      _1023: () => globalThis.Symbol,
      _1026: x0 => x0.clipboard,
      _1027: x0 => x0.maxTouchPoints,
      _1028: x0 => x0.vendor,
      _1029: x0 => x0.language,
      _1030: x0 => x0.platform,
      _1031: x0 => x0.userAgent,
      _1032: x0 => x0.languages,
      _1033: x0 => x0.documentElement,
      _1034: (x0,x1) => x0.querySelector(x1),
      _1037: (x0,x1) => x0.createElement(x1),
      _1038: (x0,x1) => x0.execCommand(x1),
      _1042: (x0,x1) => x0.createTextNode(x1),
      _1043: (x0,x1) => x0.createEvent(x1),
      _1048: x0 => x0.head,
      _1049: x0 => x0.body,
      _1050: (x0,x1) => x0.title = x1,
      _1053: x0 => x0.activeElement,
      _1056: x0 => x0.visibilityState,
      _1057: x0 => x0.hasFocus(),
      _1058: () => globalThis.document,
      _1059: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1060: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1061: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      _1063: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1063(f,arguments.length,x0) }),
      _1064: x0 => x0.target,
      _1066: x0 => x0.timeStamp,
      _1067: x0 => x0.type,
      _1069: x0 => x0.preventDefault(),
      _1071: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      _1078: x0 => x0.firstChild,
      _1083: x0 => x0.parentElement,
      _1085: x0 => x0.parentNode,
      _1089: (x0,x1) => x0.removeChild(x1),
      _1091: (x0,x1) => x0.removeChild(x1),
      _1092: x0 => x0.isConnected,
      _1093: (x0,x1) => x0.textContent = x1,
      _1095: (x0,x1) => x0.contains(x1),
      _1100: x0 => x0.firstElementChild,
      _1102: x0 => x0.nextElementSibling,
      _1103: x0 => x0.clientHeight,
      _1104: x0 => x0.clientWidth,
      _1105: x0 => x0.offsetHeight,
      _1106: x0 => x0.offsetWidth,
      _1107: x0 => x0.id,
      _1108: (x0,x1) => x0.id = x1,
      _1111: (x0,x1) => x0.spellcheck = x1,
      _1112: x0 => x0.tagName,
      _1113: x0 => x0.style,
      _1114: (x0,x1) => x0.append(x1),
      _1115: (x0,x1) => x0.getAttribute(x1),
      _1117: x0 => x0.getBoundingClientRect(),
      _1122: (x0,x1) => x0.closest(x1),
      _1124: (x0,x1) => x0.querySelectorAll(x1),
      _1125: x0 => x0.remove(),
      _1126: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _1127: (x0,x1) => x0.removeAttribute(x1),
      _1128: (x0,x1) => x0.tabIndex = x1,
      _1130: (x0,x1) => x0.focus(x1),
      _1131: x0 => x0.scrollTop,
      _1132: (x0,x1) => x0.scrollTop = x1,
      _1133: x0 => x0.scrollLeft,
      _1134: (x0,x1) => x0.scrollLeft = x1,
      _1135: x0 => x0.classList,
      _1136: (x0,x1) => x0.className = x1,
      _1142: (x0,x1) => x0.getElementsByClassName(x1),
      _1144: x0 => x0.click(),
      _1146: (x0,x1) => x0.hasAttribute(x1),
      _1149: (x0,x1) => x0.attachShadow(x1),
      _1153: (x0,x1) => x0.getPropertyValue(x1),
      _1154: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      _1156: (x0,x1) => x0.removeProperty(x1),
      _1158: x0 => x0.offsetLeft,
      _1159: x0 => x0.offsetTop,
      _1160: x0 => x0.offsetParent,
      _1162: (x0,x1) => x0.name = x1,
      _1163: x0 => x0.content,
      _1164: (x0,x1) => x0.content = x1,
      _1178: (x0,x1) => x0.nonce = x1,
      _1183: x0 => x0.now(),
      _1185: (x0,x1) => x0.width = x1,
      _1187: (x0,x1) => x0.height = x1,
      _1191: (x0,x1) => x0.getContext(x1),
      _1260: x0 => x0.width,
      _1261: x0 => x0.height,
      _1265: (x0,x1) => x0.fetch(x1),
      _1266: x0 => x0.status,
      _1268: x0 => x0.body,
      _1269: x0 => x0.arrayBuffer(),
      _1275: x0 => x0.read(),
      _1276: x0 => x0.value,
      _1277: x0 => x0.done,
      _1280: x0 => x0.x,
      _1281: x0 => x0.y,
      _1284: x0 => x0.top,
      _1285: x0 => x0.right,
      _1286: x0 => x0.bottom,
      _1287: x0 => x0.left,
      _1296: x0 => x0.height,
      _1297: x0 => x0.width,
      _1298: (x0,x1) => x0.value = x1,
      _1300: (x0,x1) => x0.placeholder = x1,
      _1301: (x0,x1) => x0.name = x1,
      _1302: x0 => x0.selectionDirection,
      _1303: x0 => x0.selectionStart,
      _1304: x0 => x0.selectionEnd,
      _1307: x0 => x0.value,
      _1309: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1312: x0 => x0.readText(),
      _1313: (x0,x1) => x0.writeText(x1),
      _1314: x0 => x0.altKey,
      _1315: x0 => x0.code,
      _1316: x0 => x0.ctrlKey,
      _1317: x0 => x0.key,
      _1318: x0 => x0.keyCode,
      _1319: x0 => x0.location,
      _1320: x0 => x0.metaKey,
      _1321: x0 => x0.repeat,
      _1322: x0 => x0.shiftKey,
      _1323: x0 => x0.isComposing,
      _1324: (x0,x1) => x0.getModifierState(x1),
      _1326: x0 => x0.state,
      _1327: (x0,x1) => x0.go(x1),
      _1330: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _1331: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _1332: x0 => x0.pathname,
      _1333: x0 => x0.search,
      _1334: x0 => x0.hash,
      _1338: x0 => x0.state,
      _1344: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1344(f,arguments.length,x0,x1) }),
      _1347: (x0,x1,x2) => x0.observe(x1,x2),
      _1350: x0 => x0.attributeName,
      _1351: x0 => x0.type,
      _1352: x0 => x0.matches,
      _1356: x0 => x0.matches,
      _1358: x0 => x0.relatedTarget,
      _1359: x0 => x0.clientX,
      _1360: x0 => x0.clientY,
      _1361: x0 => x0.offsetX,
      _1362: x0 => x0.offsetY,
      _1365: x0 => x0.button,
      _1366: x0 => x0.buttons,
      _1367: x0 => x0.ctrlKey,
      _1369: (x0,x1) => x0.getModifierState(x1),
      _1372: x0 => x0.pointerId,
      _1373: x0 => x0.pointerType,
      _1374: x0 => x0.pressure,
      _1375: x0 => x0.tiltX,
      _1376: x0 => x0.tiltY,
      _1377: x0 => x0.getCoalescedEvents(),
      _1379: x0 => x0.deltaX,
      _1380: x0 => x0.deltaY,
      _1381: x0 => x0.wheelDeltaX,
      _1382: x0 => x0.wheelDeltaY,
      _1383: x0 => x0.deltaMode,
      _1389: x0 => x0.changedTouches,
      _1391: x0 => x0.clientX,
      _1392: x0 => x0.clientY,
      _1394: x0 => x0.data,
      _1397: (x0,x1) => x0.disabled = x1,
      _1398: (x0,x1) => x0.type = x1,
      _1399: (x0,x1) => x0.max = x1,
      _1400: (x0,x1) => x0.min = x1,
      _1401: (x0,x1) => x0.value = x1,
      _1402: x0 => x0.value,
      _1403: x0 => x0.disabled,
      _1404: (x0,x1) => x0.disabled = x1,
      _1405: (x0,x1) => x0.placeholder = x1,
      _1406: (x0,x1) => x0.name = x1,
      _1407: (x0,x1) => x0.autocomplete = x1,
      _1408: x0 => x0.selectionDirection,
      _1409: x0 => x0.selectionStart,
      _1410: x0 => x0.selectionEnd,
      _1414: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1419: (x0,x1) => x0.add(x1),
      _1422: (x0,x1) => x0.noValidate = x1,
      _1423: (x0,x1) => x0.method = x1,
      _1424: (x0,x1) => x0.action = x1,
      _1430: (x0,x1) => x0.getContext(x1),
      _1432: x0 => x0.convertToBlob(),
      _1450: x0 => x0.orientation,
      _1451: x0 => x0.width,
      _1452: x0 => x0.height,
      _1453: (x0,x1) => x0.lock(x1),
      _1470: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1470(f,arguments.length,x0,x1) }),
      _1480: x0 => x0.length,
      _1481: (x0,x1) => x0.item(x1),
      _1482: x0 => x0.length,
      _1483: (x0,x1) => x0.item(x1),
      _1484: x0 => x0.iterator,
      _1485: x0 => x0.Segmenter,
      _1486: x0 => x0.v8BreakIterator,
      _1490: x0 => x0.done,
      _1491: x0 => x0.value,
      _1492: x0 => x0.index,
      _1496: (x0,x1) => x0.adoptText(x1),
      _1497: x0 => x0.first(),
      _1498: x0 => x0.next(),
      _1499: x0 => x0.current(),
      _1511: x0 => x0.hostElement,
      _1512: x0 => x0.viewConstraints,
      _1514: x0 => x0.maxHeight,
      _1515: x0 => x0.maxWidth,
      _1516: x0 => x0.minHeight,
      _1517: x0 => x0.minWidth,
      _1518: x0 => x0.loader,
      _1519: () => globalThis._flutter,
      _1520: (x0,x1) => x0.didCreateEngineInitializer(x1),
      _1521: (x0,x1,x2) => x0.call(x1,x2),
      _1522: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1522(f,arguments.length,x0,x1) }),
      _1523: x0 => new Promise(x0),
      _1528: x0 => x0.length,
      _1590: () => globalThis.window.__flutterState,
      _1591: x0 => globalThis.window.__flutterState = x0,
      _1621: x0 => new Array(x0),
      _1623: x0 => x0.length,
      _1625: (x0,x1) => x0[x1],
      _1626: (x0,x1,x2) => x0[x1] = x2,
      _1629: (x0,x1,x2) => new DataView(x0,x1,x2),
      _1631: x0 => new Int8Array(x0),
      _1632: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      _1633: x0 => new Uint8Array(x0),
      _1641: x0 => new Int32Array(x0),
      _1643: x0 => new Uint32Array(x0),
      _1645: x0 => new Float32Array(x0),
      _1647: x0 => new Float64Array(x0),
      _1649: (o, c) => o instanceof c,
      _1653: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1653(f,arguments.length,x0) }),
      _1654: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1654(f,arguments.length,x0) }),
      _1679: (decoder, codeUnits) => decoder.decode(codeUnits),
      _1680: () => new TextDecoder("utf-8", {fatal: true}),
      _1681: () => new TextDecoder("utf-8", {fatal: false}),
      _1682: x0 => new WeakRef(x0),
      _1683: x0 => x0.deref(),
      _1689: Date.now,
      _1691: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _1692: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _1693: () => {
        let stackString = new Error().stack.toString();
        let frames = stackString.split('\n');
        let drop = 2;
        if (frames[0] === 'Error') {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _1694: () => typeof dartUseDateNowForTicks !== "undefined",
      _1695: () => 1000 * performance.now(),
      _1696: () => Date.now(),
      _1697: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      _1698: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      _1699: () => new WeakMap(),
      _1700: (map, o) => map.get(o),
      _1701: (map, o, v) => map.set(o, v),
      _1702: () => globalThis.WeakRef,
      _1712: s => JSON.stringify(s),
      _1713: s => printToConsole(s),
      _1714: a => a.join(''),
      _1715: (o, a, b) => o.replace(a, b),
      _1717: (s, t) => s.split(t),
      _1718: s => s.toLowerCase(),
      _1719: s => s.toUpperCase(),
      _1720: s => s.trim(),
      _1721: s => s.trimLeft(),
      _1722: s => s.trimRight(),
      _1724: (s, p, i) => s.indexOf(p, i),
      _1725: (s, p, i) => s.lastIndexOf(p, i),
      _1726: (s) => s.replace(/\$/g, "$$$$"),
      _1727: Object.is,
      _1728: s => s.toUpperCase(),
      _1729: s => s.toLowerCase(),
      _1730: (a, i) => a.push(i),
      _1734: a => a.pop(),
      _1735: (a, i) => a.splice(i, 1),
      _1737: (a, s) => a.join(s),
      _1738: (a, s, e) => a.slice(s, e),
      _1740: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
      _1741: a => a.length,
      _1743: (a, i) => a[i],
      _1744: (a, i, v) => a[i] = v,
      _1746: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      _1747: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _1748: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _1749: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _1750: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _1751: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _1752: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _1753: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _1755: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      _1756: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _1757: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _1758: (t, s) => t.set(s),
      _1760: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _1762: o => o.buffer,
      _1763: o => o.byteOffset,
      _1764: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _1765: (b, o) => new DataView(b, o),
      _1766: (b, o, l) => new DataView(b, o, l),
      _1767: Function.prototype.call.bind(DataView.prototype.getUint8),
      _1768: Function.prototype.call.bind(DataView.prototype.setUint8),
      _1769: Function.prototype.call.bind(DataView.prototype.getInt8),
      _1770: Function.prototype.call.bind(DataView.prototype.setInt8),
      _1771: Function.prototype.call.bind(DataView.prototype.getUint16),
      _1772: Function.prototype.call.bind(DataView.prototype.setUint16),
      _1773: Function.prototype.call.bind(DataView.prototype.getInt16),
      _1774: Function.prototype.call.bind(DataView.prototype.setInt16),
      _1775: Function.prototype.call.bind(DataView.prototype.getUint32),
      _1776: Function.prototype.call.bind(DataView.prototype.setUint32),
      _1777: Function.prototype.call.bind(DataView.prototype.getInt32),
      _1778: Function.prototype.call.bind(DataView.prototype.setInt32),
      _1781: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      _1782: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      _1783: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _1784: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _1785: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _1786: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _1788: () => globalThis.performance,
      _1789: () => globalThis.JSON,
      _1790: x0 => x0.measure,
      _1791: x0 => x0.mark,
      _1792: x0 => x0.clearMeasures,
      _1793: x0 => x0.clearMarks,
      _1794: (x0,x1,x2,x3) => x0.measure(x1,x2,x3),
      _1795: (x0,x1,x2) => x0.mark(x1,x2),
      _1796: x0 => x0.clearMeasures(),
      _1797: x0 => x0.clearMarks(),
      _1798: (x0,x1) => x0.parse(x1),
      _1799: () => new XMLHttpRequest(),
      _1800: (x0,x1,x2) => x0.open(x1,x2),
      _1801: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      _1802: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      _1803: x0 => x0.abort(),
      _1804: x0 => x0.abort(),
      _1805: x0 => x0.abort(),
      _1806: x0 => x0.abort(),
      _1807: (x0,x1) => x0.send(x1),
      _1808: x0 => x0.send(),
      _1810: x0 => x0.getAllResponseHeaders(),
      _1811: (o, t) => o instanceof t,
      _1813: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1813(f,arguments.length,x0) }),
      _1814: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1814(f,arguments.length,x0) }),
      _1815: o => Object.keys(o),
      _1816: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _1817: (handle) => clearTimeout(handle),
      _1818: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      _1819: (handle) => clearInterval(handle),
      _1820: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _1821: () => Date.now(),
      _1829: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1829(f,arguments.length,x0) }),
      _1830: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1830(f,arguments.length,x0) }),
      _1831: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1832: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      _1853: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _1854: (x0,x1) => x0.exec(x1),
      _1855: (x0,x1) => x0.test(x1),
      _1856: (x0,x1) => x0.exec(x1),
      _1857: (x0,x1) => x0.exec(x1),
      _1858: x0 => x0.pop(),
      _1860: o => o === undefined,
      _1879: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _1881: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _1882: o => o instanceof RegExp,
      _1883: (l, r) => l === r,
      _1884: o => o,
      _1885: o => o,
      _1886: o => o,
      _1887: b => !!b,
      _1888: o => o.length,
      _1891: (o, i) => o[i],
      _1892: f => f.dartFunction,
      _1893: l => arrayFromDartList(Int8Array, l),
      _1894: l => arrayFromDartList(Uint8Array, l),
      _1895: l => arrayFromDartList(Uint8ClampedArray, l),
      _1896: l => arrayFromDartList(Int16Array, l),
      _1897: l => arrayFromDartList(Uint16Array, l),
      _1898: l => arrayFromDartList(Int32Array, l),
      _1899: l => arrayFromDartList(Uint32Array, l),
      _1900: l => arrayFromDartList(Float32Array, l),
      _1901: l => arrayFromDartList(Float64Array, l),
      _1902: x0 => new ArrayBuffer(x0),
      _1903: (data, length) => {
        const getValue = dartInstance.exports.$byteDataGetUint8;
        const view = new DataView(new ArrayBuffer(length));
        for (let i = 0; i < length; i++) {
          view.setUint8(i, getValue(data, i));
        }
        return view;
      },
      _1904: l => arrayFromDartList(Array, l),
      _1905: (s, length) => {
        if (length == 0) return '';
      
        const read = dartInstance.exports.$stringRead1;
        let result = '';
        let index = 0;
        const chunkLength = Math.min(length - index, 500);
        let array = new Array(chunkLength);
        while (index < length) {
          const newChunkLength = Math.min(length - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(s, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      _1906: (s, length) => {
        if (length == 0) return '';
      
        const read = dartInstance.exports.$stringRead2;
        let result = '';
        let index = 0;
        const chunkLength = Math.min(length - index, 500);
        let array = new Array(chunkLength);
        while (index < length) {
          const newChunkLength = Math.min(length - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(s, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      _1907: (s) => {
        let length = s.length;
        let range = 0;
        for (let i = 0; i < length; i++) {
          range |= s.codePointAt(i);
        }
        const exports = dartInstance.exports;
        if (range < 256) {
          if (length <= 10) {
            if (length == 1) {
              return exports.$stringAllocate1_1(s.codePointAt(0));
            }
            if (length == 2) {
              return exports.$stringAllocate1_2(s.codePointAt(0), s.codePointAt(1));
            }
            if (length == 3) {
              return exports.$stringAllocate1_3(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2));
            }
            if (length == 4) {
              return exports.$stringAllocate1_4(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3));
            }
            if (length == 5) {
              return exports.$stringAllocate1_5(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4));
            }
            if (length == 6) {
              return exports.$stringAllocate1_6(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5));
            }
            if (length == 7) {
              return exports.$stringAllocate1_7(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6));
            }
            if (length == 8) {
              return exports.$stringAllocate1_8(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7));
            }
            if (length == 9) {
              return exports.$stringAllocate1_9(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7), s.codePointAt(8));
            }
            if (length == 10) {
              return exports.$stringAllocate1_10(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7), s.codePointAt(8), s.codePointAt(9));
            }
          }
          const dartString = exports.$stringAllocate1(length);
          const write = exports.$stringWrite1;
          for (let i = 0; i < length; i++) {
            write(dartString, i, s.codePointAt(i));
          }
          return dartString;
        } else {
          const dartString = exports.$stringAllocate2(length);
          const write = exports.$stringWrite2;
          for (let i = 0; i < length; i++) {
            write(dartString, i, s.charCodeAt(i));
          }
          return dartString;
        }
      },
      _1908: () => ({}),
      _1909: () => [],
      _1910: l => new Array(l),
      _1911: () => globalThis,
      _1912: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _1913: (o, p) => p in o,
      _1914: (o, p) => o[p],
      _1915: (o, p, v) => o[p] = v,
      _1916: (o, m, a) => o[m].apply(o, a),
      _1918: o => String(o),
      _1919: (p, s, f) => p.then(s, f),
      _1920: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        return 17;
      },
      _1921: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1922: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1925: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1926: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1927: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1928: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1929: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1930: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1931: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      _1933: x0 => x0.input,
      _1934: x0 => x0.index,
      _1940: x0 => x0.flags,
      _1941: x0 => x0.multiline,
      _1942: x0 => x0.ignoreCase,
      _1943: x0 => x0.unicode,
      _1944: x0 => x0.dotAll,
      _1945: (x0,x1) => x0.lastIndex = x1,
      _1947: (o, p) => o[p],
      _1950: v => v.toString(),
      _1951: (d, digits) => d.toFixed(digits),
      _1954: (d, precision) => d.toPrecision(precision),
      _1955: x0 => x0.random(),
      _1956: x0 => x0.random(),
      _1960: () => globalThis.Math,
      _2009: x0 => x0.readyState,
      _2011: (x0,x1) => x0.timeout = x1,
      _2013: (x0,x1) => x0.withCredentials = x1,
      _2014: x0 => x0.upload,
      _2015: x0 => x0.responseURL,
      _2016: x0 => x0.status,
      _2017: x0 => x0.statusText,
      _2019: (x0,x1) => x0.responseType = x1,
      _2020: x0 => x0.response,
      _2034: x0 => x0.loaded,
      _2035: x0 => x0.total,
      _13636: () => globalThis.window.flutterCanvasKit,
      _13637: () => globalThis.window._flutter_skwasmInstance,

    };

    const baseImports = {
      dart2wasm: dart2wasm,


      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
    };

    const deferredLibraryHelper = {
      "loadModule": async (moduleName) => {
        if (!loadDeferredWasm) {
          throw "No implementation of loadDeferredWasm provided.";
        }
        const source = await Promise.resolve(loadDeferredWasm(moduleName));
        const module = await ((source instanceof Response)
            ? WebAssembly.compileStreaming(source, this.builtins)
            : WebAssembly.compile(source, this.builtins));
        return await WebAssembly.instantiate(module, {
          ...baseImports,
          ...additionalImports,
          "wasm:js-string": jsStringPolyfill,
          "module0": dartInstance.exports,
        });
      },
    };

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      "deferredLibraryHelper": deferredLibraryHelper,
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}

