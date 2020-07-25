/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "acc9661bc601aa9368ee";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "index";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/lib/AVLTree.ts":
/*!****************************!*\
  !*** ./src/lib/AVLTree.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.AVLTree = exports.AVLTreeNode = void 0;\r\nconst BTree_1 = __webpack_require__(/*! ./BTree */ \"./src/lib/BTree.ts\");\r\nconst Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nclass AVLTreeNode extends BTree_1.BTreeNode {\r\n    constructor(value) {\r\n        super(value);\r\n        this.depth = 1;\r\n    }\r\n}\r\nexports.AVLTreeNode = AVLTreeNode;\r\nclass AVLTree extends BTree_1.SearchBTree {\r\n    constructor(comparer) {\r\n        super(undefined, comparer);\r\n    }\r\n    insert(value) {\r\n        let stack = new Stack_1.default(), comp = 0, parent = void 0, node = this.root;\r\n        while (node != undefined) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0)\r\n                return false;\r\n            else {\r\n                if (comp < 0) {\r\n                    node = node.left;\r\n                }\r\n                else {\r\n                    node = node.right;\r\n                }\r\n                stack.push(parent);\r\n            }\r\n        }\r\n        if (!parent)\r\n            return this.root = newNode(value), true;\r\n        insertNode(parent, node = newNode(value), comp);\r\n        balanceTree(this, stack);\r\n        return true;\r\n    }\r\n    delete(value) {\r\n        let stack = new Stack_1.default(), comp = 0, parent = void 0, root = void 0, node = this.root, min = void 0, found = false;\r\n        while (node != undefined && !found) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0)\r\n                found = true;\r\n            else {\r\n                if (comp < 0) {\r\n                    node = node.left;\r\n                }\r\n                else {\r\n                    node = node.right;\r\n                }\r\n                stack.push(parent);\r\n            }\r\n        }\r\n        if (!found)\r\n            return false;\r\n        parent = stack.peek();\r\n        if (node.isLeaf) {\r\n            if (!parent) {\r\n                this.root = void 0;\r\n                return true;\r\n            }\r\n            setChild(void 0, parent, this.comparer(node.value, parent.value));\r\n        }\r\n        else if (node.left && node.right) {\r\n            if (getDepth(node.left) >= getDepth(node.right)) {\r\n                root = node.left;\r\n                if (root.right) {\r\n                    min = deleteMin(this, root.right, root, 1);\r\n                    min.right = node.right;\r\n                    min.left = root;\r\n                    root = min;\r\n                }\r\n                else\r\n                    root.right = node.right;\r\n            }\r\n            else {\r\n                root = node.right;\r\n                if (root.left) {\r\n                    min = deleteMin(this, root, node, 1);\r\n                    root.left = void 0;\r\n                    min.left = node.left;\r\n                    min.right = root;\r\n                    root = min;\r\n                }\r\n                else\r\n                    root.left = node.left;\r\n            }\r\n            setDepth(root);\r\n            if (!parent)\r\n                this.root = root;\r\n            else {\r\n                setChild(root, parent, this.comparer(root.value, parent.value));\r\n            }\r\n        }\r\n        else {\r\n            if (!parent) {\r\n                this.root = (node.left || node.right);\r\n                return true;\r\n            }\r\n            setChild(node.left || node.right, parent, this.comparer(node.value, parent.value));\r\n        }\r\n        balanceTree(this, stack);\r\n        return true;\r\n    }\r\n}\r\nexports.AVLTree = AVLTree;\r\nfunction newNode(value) {\r\n    return new AVLTreeNode(value);\r\n}\r\nconst getDepth = (n) => (n === null || n === void 0 ? void 0 : n.depth) || 0;\r\nfunction setDepth(node) {\r\n    let ldepth = getDepth(node.left), rdepth = getDepth(node.right);\r\n    node.depth = Math.max(ldepth, rdepth) + 1;\r\n    return rdepth - ldepth;\r\n}\r\nfunction insertNode(parent, node, comp) {\r\n    if (comp < 0) {\r\n        parent.left = node;\r\n    }\r\n    else {\r\n        parent.right = node;\r\n    }\r\n    return parent;\r\n}\r\nfunction setChild(node, parent, comp) {\r\n    if (comp < 0)\r\n        parent.left = node;\r\n    else\r\n        parent.right = node;\r\n}\r\nfunction deleteMin(tree, node, parent, comp) {\r\n    let stack = new Stack_1.default();\r\n    if (node.left)\r\n        comp = -1;\r\n    while (node.left != undefined) {\r\n        parent = node;\r\n        node = node.left;\r\n        if (node.left)\r\n            stack.push(node);\r\n    }\r\n    setChild(node.right, parent, comp);\r\n    setDepth(parent);\r\n    balanceTree(tree, stack);\r\n    return node;\r\n}\r\nfunction balanceTree(tree, stack) {\r\n    while (!stack.empty) {\r\n        let parent = void 0, node = stack.pop(), balance = setDepth(node), childrenBalance = 0, root = void 0;\r\n        if (node.depth > 2 && Math.abs(balance) > 1) {\r\n            if (balance < 0) {\r\n                root = node.left;\r\n                childrenBalance = getDepth(root.right) - getDepth(root.left);\r\n                if (childrenBalance < 0) {\r\n                    node.left = root.right;\r\n                    root.right = node;\r\n                }\r\n                else {\r\n                    parent = root;\r\n                    root = root.right;\r\n                    parent.right = root.left;\r\n                    root.left = parent;\r\n                    node.left = root.right;\r\n                    root.right = node;\r\n                    setDepth(parent);\r\n                }\r\n            }\r\n            else {\r\n                root = node.right;\r\n                childrenBalance = getDepth(root.right) - getDepth(root.left);\r\n                if (childrenBalance > 0) {\r\n                    node.right = root.left;\r\n                    root.left = node;\r\n                }\r\n                else {\r\n                    parent = root;\r\n                    root = root.left;\r\n                    parent.left = root.right;\r\n                    root.right = parent;\r\n                    node.right = root.left;\r\n                    root.left = node;\r\n                    setDepth(parent);\r\n                }\r\n            }\r\n            setDepth(node);\r\n            setDepth(root);\r\n            parent = stack.peek();\r\n            if (!parent) {\r\n                tree.root = root;\r\n            }\r\n            else {\r\n                if (tree.comparer(root.value, parent.value) > 0)\r\n                    parent.right = root;\r\n                else\r\n                    parent.left = root;\r\n                setDepth(parent);\r\n            }\r\n        }\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/AVLTree.ts?");

/***/ }),

/***/ "./src/lib/BTree.ts":
/*!**************************!*\
  !*** ./src/lib/BTree.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.SearchBTree = exports.BTree = exports.SearchBTreeTraverse = exports.BTreeNode = void 0;\r\nconst Tree_1 = __webpack_require__(/*! ./Tree */ \"./src/lib/Tree.ts\");\r\nconst Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nclass BTreeNode extends Tree_1.ValueNode {\r\n    constructor(value, left, right) {\r\n        super(value);\r\n        this.left = left;\r\n        this.right = right;\r\n    }\r\n    get isLeaf() { return !this.left && !this.right; }\r\n    get children() {\r\n        return [this.left, this.right].filter(item => !!item);\r\n    }\r\n}\r\nexports.BTreeNode = BTreeNode;\r\nvar SearchBTreeTraverse;\r\n(function (SearchBTreeTraverse) {\r\n    SearchBTreeTraverse[SearchBTreeTraverse[\"Root\"] = 0] = \"Root\";\r\n    SearchBTreeTraverse[SearchBTreeTraverse[\"Left\"] = 1] = \"Left\";\r\n    SearchBTreeTraverse[SearchBTreeTraverse[\"Right\"] = 2] = \"Right\";\r\n})(SearchBTreeTraverse = exports.SearchBTreeTraverse || (exports.SearchBTreeTraverse = {}));\r\nclass BTree extends Tree_1.BaseTree {\r\n    constructor(root, comparer) {\r\n        super(comparer);\r\n        this.root = root;\r\n    }\r\n    find(value) {\r\n        let key = this.findKey(value);\r\n        return key.comp == 0 ? key.node : undefined;\r\n    }\r\n    //(LNR)\r\n    *inOrderEnumerator(node) {\r\n        let stack = new Stack_1.default(), count = 0, n = node || this.root;\r\n        while (!stack.empty || n != undefined) {\r\n            if (n != undefined) {\r\n                stack.push(n);\r\n                n = n.left;\r\n            }\r\n            else {\r\n                n = stack.pop();\r\n                count++;\r\n                yield n;\r\n                n = n.right;\r\n            }\r\n        }\r\n        return count;\r\n    }\r\n    *postOrderEnumerator(node) {\r\n        let stack = new Stack_1.default(), n = node || this.root, lastNodeVisited, count = 0;\r\n        while (!stack.empty || n != undefined) {\r\n            if (n != undefined) {\r\n                stack.push(n);\r\n                n = n.left;\r\n            }\r\n            else {\r\n                let peekNode = stack.peek();\r\n                // if right child exists and traversing node from left child, then move right\r\n                if (peekNode.right != undefined && lastNodeVisited != peekNode.right)\r\n                    n = peekNode.right;\r\n                else {\r\n                    count++;\r\n                    yield peekNode;\r\n                    lastNodeVisited = stack.pop();\r\n                }\r\n            }\r\n        }\r\n        return count;\r\n    }\r\n    newNode(value) {\r\n        return new BTreeNode(value);\r\n    }\r\n    findKey(value) {\r\n        let comp = 0, parent = void 0, node = this.root;\r\n        while (node != undefined) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0) {\r\n                return {\r\n                    node: node,\r\n                    parent: parent,\r\n                    comp: comp\r\n                };\r\n            }\r\n            else if (comp < 0) {\r\n                node = node.left;\r\n            }\r\n            else {\r\n                node = node.right;\r\n            }\r\n        }\r\n        return { node: node, parent: parent, comp: comp };\r\n    }\r\n    min(node) {\r\n        if (node)\r\n            while (node.left != undefined)\r\n                node = node.left;\r\n        return node;\r\n    }\r\n    max(node) {\r\n        if (node)\r\n            while (node.right != undefined)\r\n                node = node.right;\r\n        return node;\r\n    }\r\n}\r\nexports.BTree = BTree;\r\nclass SearchBTree extends BTree {\r\n    insertRange(values) {\r\n        let array = [];\r\n        values.forEach(value => array.push(this.insert(value)));\r\n        return array;\r\n    }\r\n    deleteRange(values) {\r\n        let array = [];\r\n        values.forEach(value => array.push(this.delete(value)));\r\n        return array;\r\n    }\r\n}\r\nexports.SearchBTree = SearchBTree;\r\n\n\n//# sourceURL=webpack:///./src/lib/BTree.ts?");

/***/ }),

/***/ "./src/lib/Graph-Utils.ts":
/*!********************************!*\
  !*** ./src/lib/Graph-Utils.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.generatorObjToArray = exports.generatorValueToArray = exports.visulizeTree = exports.displayGraphMatrix = exports.displayMatrix = exports.fromJSON = exports.toMatrix = exports.transposeMatrix = void 0;\r\nconst Graph_1 = __webpack_require__(/*! ./Graph */ \"./src/lib/Graph.ts\");\r\nconst Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/lib/Utils.ts\");\r\nfunction toMatrix(g) {\r\n    let array = Utils_1.matrix(g.size, g.size, 0);\r\n    //row v and column w\r\n    g.edges().forEach((edge) => array[edge.v][edge.w] = 1);\r\n    return array;\r\n}\r\nexports.toMatrix = toMatrix;\r\n;\r\nfunction transposeMatrix(g) {\r\n    let array = Utils_1.matrix(g.size, g.size, 0);\r\n    //row v and column w\r\n    g.edges().forEach((edge) => array[edge.w][edge.v] = 1);\r\n    return array;\r\n}\r\nexports.transposeMatrix = transposeMatrix;\r\n//this displays numbers\r\nfunction displayMatrix(matrix) {\r\n    let width = String(matrix.length).length + 1;\r\n    let header = Utils_1.fillChar(' ', width) + '|' + Utils_1.range(0, matrix.length).map(n => Utils_1.formatNumber(n, width)).join(' ');\r\n    console.log(header);\r\n    console.log(Utils_1.fillChar('-', header.length + 1));\r\n    Utils_1.range(0, matrix.length).forEach(v => {\r\n        console.log(Utils_1.formatNumber(v, width) + '|' + Utils_1.range(0, matrix.length).map(w => Utils_1.formatNumber(matrix[v][w], width)).join(' '));\r\n    });\r\n}\r\nexports.displayMatrix = displayMatrix;\r\n//this displays labels\r\nfunction displayGraphMatrix(g) {\r\n    let matrix = toMatrix(g), width = Math.max.apply(null, g.nodeList().map(n => n.label().length)) + 1;\r\n    let header = Utils_1.fillChar(' ', width) + '|' + Utils_1.range(0, g.size).map(n => Utils_1.formatNumber(n, width)).join(' ');\r\n    console.log(header);\r\n    console.log(Utils_1.fillChar('-', header.length + 1));\r\n    Utils_1.range(0, g.size).forEach(v => {\r\n        console.log(Utils_1.formatNumber(v, width) + '|' + Utils_1.range(0, g.size).map(w => Utils_1.formatNumber(matrix[v][w], width)).join(' '));\r\n    });\r\n}\r\nexports.displayGraphMatrix = displayGraphMatrix;\r\nfunction fromJSON(content) {\r\n    let name = content[\"name\"], directed = Utils_1.toBool(content[\"directed\"]), weighted = Utils_1.toBool(content[\"weighted\"]), labeled = !!content[\"labels\"], labels = (labeled ? Array.from(content[\"labels\"]) : undefined), labelMap = new Map(), nodes = labeled ? 0 : parseInt(content[\"nodes\"]), edges = Array.from(content[\"edges\"]), getNode = (nodeOrLabel) => {\r\n        if (labeled) {\r\n            let n = labelMap.get(nodeOrLabel);\r\n            return {\r\n                node: n != undefined ? n : -1,\r\n                label: nodeOrLabel\r\n            };\r\n        }\r\n        else\r\n            return { node: g.hasNode(nodeOrLabel) ? nodeOrLabel : -1 };\r\n    }, getEdge = (e) => ({\r\n        v: getNode(e.from),\r\n        w: getNode(e.to),\r\n        weight: e.w\r\n    }), g = Graph_1.BaseGraph.create(name, directed, weighted, labeled);\r\n    if (labeled) {\r\n        if (!labels)\r\n            throw `invalid graph labels`;\r\n        labels.forEach((label, node) => {\r\n            g.addNode(label);\r\n            labelMap.set(label, node);\r\n        });\r\n    }\r\n    else {\r\n        Utils_1.range(0, nodes).forEach(n => g.addNode());\r\n    }\r\n    if (!edges)\r\n        throw `invalid edges`;\r\n    edges.forEach((e) => {\r\n        let edge = getEdge(e);\r\n        if (edge.v.node == -1 || edge.w.node == -1)\r\n            throw `invalid edge: ${e}`;\r\n        if (weighted) {\r\n            !edge.weight && (edge.weight = 0);\r\n            g.connect(edge.v.node, edge.w.node, edge.weight);\r\n        }\r\n        else\r\n            g.connect(edge.v.node, edge.w.node);\r\n    });\r\n    return g;\r\n}\r\nexports.fromJSON = fromJSON;\r\nfunction visulizeTree(tree) {\r\n    let columns = 0, map = new Map(), maxLabelWidth = 0, cons = [], newRow = () => new Array(columns).fill(Utils_1.fillChar(' ', maxLabelWidth + 1)), postOrder = tree.postOrderEnumerator(), result;\r\n    if (!tree || !tree.root) {\r\n        console.log('empty tree');\r\n        return;\r\n    }\r\n    while (!(result = postOrder.next()).done) {\r\n        let node = result.value;\r\n        maxLabelWidth = Math.max(maxLabelWidth, String(node.value).length);\r\n        let w = node.children.map(n => map.get(n)).reduce((acc, val) => acc + val, 0);\r\n        w = w || 2;\r\n        map.set(node, w);\r\n    }\r\n    !(maxLabelWidth & 1) && (maxLabelWidth++);\r\n    columns = map.get(tree.root);\r\n    visulizeNode(tree.root, 0, 0, columns - 1, cons, newRow, map, maxLabelWidth);\r\n    cons.forEach(row => {\r\n        console.log(`${row.join('')}`);\r\n    });\r\n}\r\nexports.visulizeTree = visulizeTree;\r\nfunction visulizeNode(node, row, mincol, maxcol, cons, newRow, map, maxLabelWidth) {\r\n    let noderow = cons[row * 2], joinsrow = cons[row * 2 + 1], colStart = mincol, columns = [], getIndex = (mmin, mmax) => (mmin + (mmax - mmin + 1) / 2 | 0), drawLine = (startcol, endcol) => {\r\n        for (let i = startcol + 1; i < endcol; i++) {\r\n            joinsrow[i] = Utils_1.fillChar('─', maxLabelWidth + 1);\r\n        }\r\n    }, rootIndex = getIndex(mincol, maxcol);\r\n    if (!noderow) {\r\n        cons.push(noderow = newRow());\r\n        cons.push(joinsrow = newRow());\r\n    }\r\n    noderow[rootIndex] = Utils_1.centerStr(String(node.value), maxLabelWidth);\r\n    node.children.forEach((child) => {\r\n        let rootWidth = map.get(child);\r\n        columns.push(getIndex(colStart, colStart + rootWidth - 1));\r\n        visulizeNode(child, row + 1, colStart, colStart + rootWidth - 1, cons, newRow, map, maxLabelWidth);\r\n        colStart += rootWidth;\r\n    });\r\n    if (columns.length) {\r\n        if (columns.length == 1)\r\n            joinsrow[columns.pop()] = Utils_1.centerPadStr('│', maxLabelWidth, ' ', ' ');\r\n        else {\r\n            let startcol = 0, endcol = columns.pop();\r\n            joinsrow[endcol] = Utils_1.centerPadStr('┐', maxLabelWidth, '─', ' ');\r\n            while (columns.length > 1) {\r\n                joinsrow[startcol = columns.pop()] = Utils_1.centerPadStr('┬', maxLabelWidth, '─', '─');\r\n                drawLine(startcol, endcol);\r\n                endcol = startcol;\r\n            }\r\n            joinsrow[startcol = columns.pop()] = Utils_1.centerPadStr('┌', maxLabelWidth, ' ', '─');\r\n            drawLine(startcol, endcol);\r\n            let rootStr = joinsrow[rootIndex], index = rootStr.length / 2 | 0;\r\n            joinsrow[rootIndex] = rootStr[index] == '─'\r\n                ? Utils_1.replaceAt(rootStr, index, '┴') : Utils_1.replaceAt(rootStr, index, '┼');\r\n        }\r\n    }\r\n}\r\nfunction generatorValueToArray(enumerator) {\r\n    let array = new Array(), result;\r\n    while (!(result = enumerator.next()).done) {\r\n        array.push(result.value);\r\n    }\r\n    return {\r\n        array: array,\r\n        value: result.value\r\n    };\r\n}\r\nexports.generatorValueToArray = generatorValueToArray;\r\nfunction generatorObjToArray(enumerator, transformer) {\r\n    let array = new Array(), result;\r\n    while (!(result = enumerator.next()).done) {\r\n        array.push(transformer(result.value));\r\n    }\r\n    return {\r\n        array: array,\r\n        value: result.value\r\n    };\r\n}\r\nexports.generatorObjToArray = generatorObjToArray;\r\n\n\n//# sourceURL=webpack:///./src/lib/Graph-Utils.ts?");

/***/ }),

/***/ "./src/lib/Graph.ts":
/*!**************************!*\
  !*** ./src/lib/Graph.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.LabeledDiGraph = exports.LabeledGraph = exports.WeightedDiGraph = exports.WeightedGraph = exports.DiGraph = exports.Graph = exports.BaseGraph = exports.EdgeVisitEnum = exports.WeightedEdge = exports.Edge = exports.LabeledNode = exports.GraphNode = void 0;\r\nconst Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/lib/Utils.ts\");\r\nclass GraphNode {\r\n    constructor(id) {\r\n        this.id = id;\r\n    }\r\n    label() { return String(this.id); }\r\n}\r\nexports.GraphNode = GraphNode;\r\nclass LabeledNode extends GraphNode {\r\n    constructor(id, __label) {\r\n        super(id);\r\n        this.__label = __label;\r\n        if (!__label)\r\n            throw `empty node label`;\r\n    }\r\n    label() { return this.__label; }\r\n}\r\nexports.LabeledNode = LabeledNode;\r\nclass Edge {\r\n    constructor(v, w) {\r\n        this.v = v;\r\n        this.w = w;\r\n    }\r\n    label() { return `(${this.v}>${this.w})`; }\r\n}\r\nexports.Edge = Edge;\r\nclass WeightedEdge extends Edge {\r\n    constructor(v, w, weight) {\r\n        super(v, w);\r\n        this.weight = weight;\r\n        if (Number.isNaN(weight))\r\n            throw `invalid edge weight`;\r\n    }\r\n    label() { return `(${this.v}>${this.w})::${this.weight}`; }\r\n}\r\nexports.WeightedEdge = WeightedEdge;\r\nvar EdgeVisitEnum;\r\n(function (EdgeVisitEnum) {\r\n    EdgeVisitEnum[EdgeVisitEnum[\"tree\"] = 0] = \"tree\";\r\n    EdgeVisitEnum[EdgeVisitEnum[\"parent\"] = 1] = \"parent\";\r\n    EdgeVisitEnum[EdgeVisitEnum[\"back\"] = 2] = \"back\";\r\n    EdgeVisitEnum[EdgeVisitEnum[\"down\"] = 3] = \"down\";\r\n    EdgeVisitEnum[EdgeVisitEnum[\"cross\"] = 4] = \"cross\";\r\n})(EdgeVisitEnum = exports.EdgeVisitEnum || (exports.EdgeVisitEnum = {}));\r\nclass BaseGraph {\r\n    constructor(name, directed, weighted, labeled) {\r\n        this.name = name;\r\n        this.directed = directed;\r\n        this.weighted = weighted;\r\n        this.labeled = labeled;\r\n        this.nodes = new Map();\r\n        this.modified = false;\r\n    }\r\n    label() { return this.name; }\r\n    get size() { return this.nodes.size; }\r\n    get nextNodeId() { return this.size; }\r\n    node(id) { var _a; return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.node; }\r\n    nodeLabel(id) { var _a; return ((_a = this.node(id)) === null || _a === void 0 ? void 0 : _a.label()) || \"\"; }\r\n    hasNode(id) { var _a; return !!((_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.node); }\r\n    nodeList() { return Array.from(this.nodes.values()).map(n => n.node); }\r\n    nodeEdges(id) { var _a; return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.edges; }\r\n    edges() { return Utils_1.selectMany(Array.from(this.nodes.values()), (n) => n.edges); }\r\n    nodeDegree(node) { var _a; return ((_a = this.nodeEdges(node)) === null || _a === void 0 ? void 0 : _a.length) || 0; }\r\n    degrees() { return Array.from({ length: this.size }, (n, ndx) => this.nodeDegree(ndx)); }\r\n    indegrees() {\r\n        let array = new Array(this.size).fill(0);\r\n        this.edges().forEach(edge => array[edge.w]++);\r\n        return array;\r\n    }\r\n    validNode(node) { return node >= 0 && node < this.size; }\r\n    addNode(label) {\r\n        let node = this.labeled ?\r\n            new LabeledNode(this.nextNodeId, label) :\r\n            new GraphNode(this.nextNodeId);\r\n        this.nodes.set(node.id, {\r\n            node: node,\r\n            edges: new Array()\r\n        });\r\n        this.modified = true;\r\n        return node;\r\n    }\r\n    connect(v, w, weight) {\r\n        let startNode = this.nodes.get(v), endNode = this.nodes.get(w), createEdge = (nv, nw) => this.weighted ?\r\n            new WeightedEdge(nv, nw, weight) :\r\n            new Edge(nv, nw);\r\n        if (!startNode || !endNode)\r\n            return false;\r\n        if (startNode.edges.some(e => e.w == w))\r\n            return false;\r\n        startNode.edges.push(createEdge(v, w));\r\n        this.modified = true;\r\n        !this.directed\r\n            && endNode.edges.push(createEdge(w, v));\r\n        return true;\r\n    }\r\n    disconnect(v, w) {\r\n        let e = getInternalEdge.call(this, v, w);\r\n        if (!e || e.index < 0)\r\n            return false;\r\n        e.edges.splice(e.index, 1);\r\n        this.modified = true;\r\n        if (!this.directed) {\r\n            e = getInternalEdge.call(this, w, v);\r\n            e.edges.splice(e.index, 1);\r\n        }\r\n        return true;\r\n    }\r\n    adjacent(v, w) {\r\n        let vNode = this.nodes.get(v);\r\n        return !!(vNode === null || vNode === void 0 ? void 0 : vNode.edges.some(n => n.w == w));\r\n    }\r\n    adjacentEdges(node) {\r\n        let vNode = this.nodes.get(node);\r\n        return (vNode === null || vNode === void 0 ? void 0 : vNode.edges.map(e => e.w)) || [];\r\n    }\r\n    edge(v, w) {\r\n        let e = getInternalEdge.call(this, v, w);\r\n        return e === null || e === void 0 ? void 0 : e.edges[e.index];\r\n    }\r\n    edgeCount() {\r\n        return Array.from(this.nodes.values()).reduce((sum, item) => sum + item.edges.length, 0);\r\n    }\r\n    // max. number of edges = ½ * |V| * ( |V| - 1 ). \r\n    //For undirected simple graphs, the graph density is defined as: \r\n    //D =     2|E|\r\n    //    -----------\r\n    //     |V|(|V| - 1)\r\n    density() {\r\n        return 2 * this.edgeCount() / (this.size * (this.size - 1));\r\n    }\r\n    static create(name, directed, weighted, labeled) {\r\n        if (labeled) {\r\n            if (weighted)\r\n                throw `weighted labeled graph not supported yet!`;\r\n            else\r\n                return directed ? new LabeledDiGraph(name) : new LabeledGraph(name);\r\n        }\r\n        else {\r\n            if (weighted)\r\n                return directed ? new WeightedDiGraph(name) : new WeightedGraph(name);\r\n            else\r\n                return directed ? new DiGraph(name) : new Graph(name);\r\n        }\r\n    }\r\n}\r\nexports.BaseGraph = BaseGraph;\r\nclass Graph extends BaseGraph {\r\n    constructor(name) {\r\n        super(name, false, false, false);\r\n    }\r\n}\r\nexports.Graph = Graph;\r\nclass DiGraph extends BaseGraph {\r\n    constructor(name) {\r\n        super(name, true, false, false);\r\n    }\r\n}\r\nexports.DiGraph = DiGraph;\r\nclass BaseWeightedGraph extends BaseGraph {\r\n    nodeEdges(id) { var _a; return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.edges; }\r\n    constructor(name, directed) {\r\n        super(name, directed, true, false);\r\n    }\r\n}\r\nclass WeightedGraph extends BaseWeightedGraph {\r\n    constructor(name) {\r\n        super(name, false);\r\n    }\r\n}\r\nexports.WeightedGraph = WeightedGraph;\r\nclass WeightedDiGraph extends BaseWeightedGraph {\r\n    constructor(name) {\r\n        super(name, true);\r\n    }\r\n}\r\nexports.WeightedDiGraph = WeightedDiGraph;\r\nclass BaseLabeledGraph extends BaseGraph {\r\n    node(id) { var _a; return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.node; }\r\n    constructor(name, directed, weighted) {\r\n        super(name, directed, weighted, true);\r\n    }\r\n}\r\nclass LabeledGraph extends BaseLabeledGraph {\r\n    constructor(name) {\r\n        super(name, false, false);\r\n    }\r\n}\r\nexports.LabeledGraph = LabeledGraph;\r\nclass LabeledDiGraph extends BaseLabeledGraph {\r\n    constructor(name) {\r\n        super(name, true, false);\r\n    }\r\n}\r\nexports.LabeledDiGraph = LabeledDiGraph;\r\nclass BaseLabeledWeightedGraph extends BaseLabeledGraph {\r\n    nodeEdges(id) { var _a; return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.edges; }\r\n    constructor(name, directed) {\r\n        super(name, directed, true);\r\n    }\r\n}\r\nfunction getInternalEdge(v, w) {\r\n    let n = this.nodes.get(v);\r\n    return n ?\r\n        { node: n.node, edges: n.edges, index: n.edges.findIndex(e => e.w == w) }\r\n        : undefined;\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/Graph.ts?");

/***/ }),

/***/ "./src/lib/Queue.ts":
/*!**************************!*\
  !*** ./src/lib/Queue.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nclass Queue extends Stack_1.default {\r\n    dequeue() { return this.pop(); }\r\n    enqueue(t) { return this.n.unshift(t); }\r\n    peek() { return this.n[0]; }\r\n    peekback() { return super.peek(); }\r\n    static from(initialData = []) {\r\n        const q = new Queue();\r\n        q.n.unshift(...initialData);\r\n        return q;\r\n    }\r\n}\r\nexports.default = Queue;\r\n\n\n//# sourceURL=webpack:///./src/lib/Queue.ts?");

/***/ }),

/***/ "./src/lib/RedBlackTree.ts":
/*!*********************************!*\
  !*** ./src/lib/RedBlackTree.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.RedBlackTree = exports.RedBlackTreeNode = exports.RedBlackEnum = void 0;\r\nconst BTree_1 = __webpack_require__(/*! ./BTree */ \"./src/lib/BTree.ts\");\r\nconst Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nvar RedBlackEnum;\r\n(function (RedBlackEnum) {\r\n    RedBlackEnum[RedBlackEnum[\"red\"] = 0] = \"red\";\r\n    RedBlackEnum[RedBlackEnum[\"black\"] = 1] = \"black\";\r\n})(RedBlackEnum = exports.RedBlackEnum || (exports.RedBlackEnum = {}));\r\nclass RedBlackTreeNode extends BTree_1.BTreeNode {\r\n    constructor(value) {\r\n        super(value);\r\n        this.color = RedBlackEnum.red;\r\n    }\r\n}\r\nexports.RedBlackTreeNode = RedBlackTreeNode;\r\nclass RedBlackTree extends BTree_1.SearchBTree {\r\n    constructor(comparer) {\r\n        super(undefined, comparer);\r\n    }\r\n    insert(value) {\r\n        let stack = new Stack_1.default(), parent = void 0, node = this.root, comp = 0;\r\n        if (node == undefined) {\r\n            this.root = node = newNode(value);\r\n            node.color = RedBlackEnum.black;\r\n            return true;\r\n        }\r\n        while (node != undefined) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0)\r\n                return false;\r\n            else {\r\n                if (comp < 0)\r\n                    node = node.left;\r\n                else\r\n                    node = node.right;\r\n                stack.push(parent);\r\n            }\r\n        }\r\n        node = newNode(value);\r\n        setChild(parent, node, comp);\r\n        balanceAfterInsert(this, node, stack);\r\n        return true;\r\n    }\r\n    delete(value) {\r\n        let found = false, comp = 0, stack = new Stack_1.default(), parent = void 0, node = this.root, yIsNode, x, ycomp = 0, yParent, y;\r\n        while (node != undefined && !found) {\r\n            let nextComp = this.comparer(value, node.value);\r\n            if (nextComp == 0)\r\n                found = true;\r\n            else {\r\n                parent = node;\r\n                if (nextComp < 0) {\r\n                    node = node.left;\r\n                }\r\n                else {\r\n                    node = node.right;\r\n                }\r\n                stack.push(parent);\r\n                comp = nextComp;\r\n            }\r\n        }\r\n        if (!found)\r\n            return false;\r\n        // \"node\" to be deleted: \r\n        //\t  is a leaf with no children\r\n        //\t  has one child\r\n        //\t  has two children\r\n        // if \"node\" is red, the red black properties still hold.\r\n        // if \"node\" is black, the tree needs rebalancing and/or recolouring\r\n        if (node.left == undefined || node.right == undefined) {\r\n            //node is leaf or has at least one empty child\r\n            y = node;\r\n            yParent = parent;\r\n            yIsNode = true;\r\n        }\r\n        else {\r\n            //node has 2 children\r\n            //replacement node is the leftmost node greater than \"node\"\r\n            stack.push(node);\r\n            y = node.right;\r\n            yParent = node;\r\n            yIsNode = false;\r\n            while (y.left != undefined) {\r\n                stack.push(y);\r\n                yParent = y;\r\n                y = y.left;\r\n            }\r\n        }\r\n        //y has the replacement node here, it's \"value\" content will be copied to \"node\"\r\n        //x is y's only child, it'll be linked to y's parent\r\n        if (y.left != undefined)\r\n            x = y.left;\r\n        else\r\n            x = y.right;\r\n        // replace x's parent with y's parent and link x to proper subtree in parent, this removes y from tree\r\n        if (yParent != undefined) {\r\n            setChild(yParent, x, ycomp = this.comparer(y.value, yParent.value));\r\n        }\r\n        else {\r\n            this.root = x;\r\n            (x != undefined) && (x.color = RedBlackEnum.black);\r\n            return true;\r\n        }\r\n        !yIsNode && (node.value = y.value);\r\n        if (y.color == RedBlackEnum.black) {\r\n            // x may be undefined\r\n            balanceAfterDelete(this, x, stack, ycomp);\r\n        }\r\n        return true;\r\n    }\r\n}\r\nexports.RedBlackTree = RedBlackTree;\r\nconst siblingComparer = (comp) => comp > 0 ? -1 : 1;\r\nfunction setChild(parent, node, comp) {\r\n    if (comp < 0)\r\n        parent.left = node;\r\n    else\r\n        parent.right = node;\r\n}\r\nfunction getChild(parent, comp) {\r\n    return (comp < 0 ? parent.left : parent.right);\r\n}\r\nfunction newNode(value) {\r\n    return new RedBlackTreeNode(value);\r\n}\r\nfunction getColor(node) {\r\n    return node == undefined ?\r\n        RedBlackEnum.black :\r\n        node.color;\r\n}\r\nfunction rotateLeft(x, tree, stack, pushParent) {\r\n    let p = stack.peek(), y = x.right;\r\n    x.right = y.left;\r\n    y.left = x;\r\n    pushParent && stack.push(y);\r\n    if (p != undefined)\r\n        setChild(p, y, tree.comparer(y.value, p.value));\r\n    else\r\n        tree.root = y;\r\n}\r\nfunction rotateRight(x, tree, stack, pushParent) {\r\n    let p = stack.peek(), y = x.left;\r\n    x.left = y.right;\r\n    y.right = x;\r\n    pushParent && stack.push(y);\r\n    if (p != undefined)\r\n        setChild(p, y, tree.comparer(y.value, p.value));\r\n    else\r\n        tree.root = y;\r\n}\r\nfunction balanceAfterInsert(tree, x, stack) {\r\n    let t, g, p, y = x.left, comp = 0;\r\n    while (stack.count >= 2 && (p = stack.pop()).color == RedBlackEnum.red) {\r\n        //parent is RED\r\n        g = stack.peek();\r\n        comp = tree.comparer(p.value, g.value);\r\n        //get x's parent uncle y\r\n        if (comp < 0)\r\n            y = g.right;\r\n        else\r\n            y = g.left;\r\n        if (y != undefined && y.color == RedBlackEnum.red) {\r\n            //uncle is RED, change x's parent and uncle to black\r\n            p.color = RedBlackEnum.black;\r\n            y.color = RedBlackEnum.black;\r\n            // grandparent must be red. Why? Every red node that is not \r\n            // a leaf has only black children\r\n            g.color = RedBlackEnum.red;\r\n            stack.pop();\r\n            x = g;\r\n        }\r\n        else {\r\n            //uncle is BLACK\r\n            if (comp < 0) {\r\n                if (tree.comparer(x.value, p.value) > 0) {\r\n                    // x > p, rotate left, make x a left child\r\n                    rotateLeft(p, tree, stack, false);\r\n                    //this's faster than ES6 array destructuring\r\n                    t = x;\r\n                    x = p;\r\n                    p = t;\r\n                }\r\n                // x < p\r\n                p.color = RedBlackEnum.black;\r\n                g.color = RedBlackEnum.red;\r\n                stack.pop();\r\n                rotateRight(g, tree, stack, true);\r\n            }\r\n            else {\r\n                if (tree.comparer(x.value, p.value) < 0) {\r\n                    // x < p, rotate right, make x a right child\r\n                    rotateRight(p, tree, stack, false);\r\n                    //this's faster than ES6 array destructuring\r\n                    t = x;\r\n                    x = p;\r\n                    p = t;\r\n                }\r\n                // x > p\r\n                p.color = RedBlackEnum.black;\r\n                g.color = RedBlackEnum.red;\r\n                stack.pop();\r\n                rotateLeft(g, tree, stack, true);\r\n            }\r\n        }\r\n    }\r\n    tree.root.color = RedBlackEnum.black;\r\n}\r\nfunction balanceAfterDelete(tree, x, stack, comp) {\r\n    let parent, y;\r\n    while (!stack.empty && getColor(x) == RedBlackEnum.black) {\r\n        parent = stack.peek();\r\n        y = getChild(parent, siblingComparer(comp));\r\n        if (comp < 0) {\r\n            //x is left child, y is right child\r\n            if (getColor(y) == RedBlackEnum.red) {\r\n                // x is black, y is red - make both black and rotate\r\n                y.color = RedBlackEnum.black;\r\n                parent.color = RedBlackEnum.red;\r\n                stack.pop();\r\n                rotateLeft(parent, tree, stack, true);\r\n                stack.push(parent);\r\n                y = parent.right;\r\n            }\r\n            if (y == undefined ||\r\n                (getColor(y.left) == RedBlackEnum.black &&\r\n                    getColor(y.right) == RedBlackEnum.black)) {\r\n                //y children are both black or y is a leaf\r\n                (y != undefined) && (y.color = RedBlackEnum.red);\r\n                //move up\r\n                stack.pop();\r\n                x = parent;\r\n                parent = stack.peek();\r\n                (parent != undefined) && (comp = tree.comparer(x.value, parent.value));\r\n            }\r\n            else {\r\n                if (getColor(y.right) == RedBlackEnum.black) {\r\n                    y.left.color = RedBlackEnum.black;\r\n                    y.color = RedBlackEnum.red;\r\n                    rotateRight(y, tree, stack, false);\r\n                    y = getChild(parent, 1);\r\n                }\r\n                y.color = parent.color; // x.parent.color\r\n                parent.color = RedBlackEnum.black;\r\n                y.right.color = RedBlackEnum.black;\r\n                stack.pop();\r\n                rotateLeft(parent, tree, stack, false);\r\n                stack.clear();\r\n                return;\r\n            }\r\n        }\r\n        else {\r\n            //y is left child, x is right child\r\n            //y could be null\r\n            if (getColor(y) == RedBlackEnum.red) {\r\n                // x is black, y is red - make both black and rotate\r\n                y.color = RedBlackEnum.black;\r\n                parent.color = RedBlackEnum.red;\r\n                stack.pop();\r\n                rotateRight(parent, tree, stack, true);\r\n                stack.push(parent);\r\n                y = parent.left;\r\n            }\r\n            if (y == undefined ||\r\n                (getColor(y.left) == RedBlackEnum.black &&\r\n                    getColor(y.right) == RedBlackEnum.black)) {\r\n                //y children are both black or y is a leaf\r\n                (y != undefined) && (y.color = RedBlackEnum.red);\r\n                //move up\r\n                stack.pop();\r\n                x = parent;\r\n                parent = stack.peek();\r\n                (parent != undefined) && (comp = tree.comparer(x.value, parent.value));\r\n            }\r\n            else {\r\n                if (getColor(y.left) == RedBlackEnum.black) {\r\n                    y.right.color = RedBlackEnum.black;\r\n                    y.color = RedBlackEnum.red;\r\n                    rotateLeft(y, tree, stack, false);\r\n                    y = getChild(parent, -1);\r\n                }\r\n                y.color = parent.color; // x.parent.color\r\n                parent.color = RedBlackEnum.black;\r\n                y.left.color = RedBlackEnum.black;\r\n                stack.pop();\r\n                rotateRight(parent, tree, stack, false);\r\n                stack.clear();\r\n                return;\r\n            }\r\n        }\r\n    }\r\n    (x != undefined) && (x.color = RedBlackEnum.black);\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/RedBlackTree.ts?");

/***/ }),

/***/ "./src/lib/Stack.ts":
/*!**************************!*\
  !*** ./src/lib/Stack.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass Stack {\r\n    constructor() {\r\n        this.clear();\r\n    }\r\n    get count() { return this.n.length; }\r\n    get last() { return this.n.length - 1; }\r\n    get items() { return this.n.slice(0); }\r\n    get empty() { return !this.n.length; }\r\n    pop() { return this.n.pop(); }\r\n    push(t) { return this.n.push(t); }\r\n    peek() { return this.n[this.last]; }\r\n    clear() { this.n = new Array(); }\r\n    static from(initialData = []) {\r\n        const s = new Stack();\r\n        s.n.push(...initialData);\r\n        return s;\r\n    }\r\n}\r\nexports.default = Stack;\r\n\n\n//# sourceURL=webpack:///./src/lib/Stack.ts?");

/***/ }),

/***/ "./src/lib/Tree.ts":
/*!*************************!*\
  !*** ./src/lib/Tree.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.Tree = exports.BaseTree = exports.TreeNode = exports.ValueNode = void 0;\r\nconst Queue_1 = __importDefault(__webpack_require__(/*! ./Queue */ \"./src/lib/Queue.ts\"));\r\nconst Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nclass ValueNode {\r\n    constructor(value) {\r\n        this.value = value;\r\n    }\r\n    /**\r\n     * @description return the amount of children\r\n     */\r\n    get length() { return this.children.length; }\r\n    /**\r\n     * @description children indexer\r\n     * @param index 0-based index of child\r\n     */\r\n    get(index) { return this.children[index]; }\r\n}\r\nexports.ValueNode = ValueNode;\r\nclass TreeNode extends ValueNode {\r\n    constructor(value, ...childrenNodes) {\r\n        super(value);\r\n        this.__children = new Array(...childrenNodes);\r\n    }\r\n    get children() { return this.__children.slice(0); }\r\n    get size() { return this.__children.length; }\r\n    get isLeaf() { return this.size == 0; }\r\n    add(value) {\r\n        let n = new TreeNode(value);\r\n        this.__children.push(n);\r\n        return n;\r\n    }\r\n    remove(value, comparer) {\r\n        let defaultComparer = (item) => item.value === value, n = this.__children.findIndex(comparer || defaultComparer);\r\n        return n != -1 ? this.__children.splice(n, 1)[0] : undefined;\r\n    }\r\n    removeAt(index) {\r\n        return index >= 0 && index < this.size ? this.__children.splice(index, 1)[0] : undefined;\r\n    }\r\n    find(value, comparer) {\r\n        let defaultComparer = (item) => item.value === value;\r\n        return this.__children.find(comparer || defaultComparer);\r\n    }\r\n}\r\nexports.TreeNode = TreeNode;\r\nclass BaseTree {\r\n    constructor(comparer) {\r\n        this.__comp = comparer || compare;\r\n    }\r\n    empty() { return this.root == undefined; }\r\n    clear() {\r\n        this.root = void 0;\r\n    }\r\n    get comparer() { return this.__comp; }\r\n    /**\r\n     * @description it calls levelOrder from root, and returns it's result with empty callback.\r\n     */\r\n    depth() {\r\n        let result, enumerator = this.levelOrderEnumerator();\r\n        while (!(result = enumerator.next()).done)\r\n            ;\r\n        return result.value;\r\n    }\r\n    *preOrderEnumerator(node) {\r\n        let stack = new Stack_1.default(), count = 0;\r\n        !node && (node = this.root);\r\n        if (node) {\r\n            stack.push(node);\r\n            while (!stack.empty) {\r\n                count++;\r\n                node = stack.pop();\r\n                yield node;\r\n                for (let children = node.children, i = children.length - 1; i >= 0; i--) {\r\n                    stack.push(children[i]);\r\n                }\r\n            }\r\n        }\r\n        return count;\r\n    }\r\n    preOrderIterator(node) {\r\n        let enumerator = this.preOrderEnumerator(node), iterator = {\r\n            //Iterator protocol\r\n            next: () => {\r\n                return enumerator.next();\r\n            },\r\n            //Iterable protocol\r\n            [Symbol.iterator]() {\r\n                return iterator;\r\n            }\r\n        };\r\n        return iterator;\r\n    }\r\n    /**\r\n     * @description it's an extended breadthSearch with a tree node level value\r\n     * @param node root node to calculate level order\r\n     * @param callback a function called for every tree node with it's level 1-based\r\n     */\r\n    *levelOrderEnumerator(node) {\r\n        let queue = new Queue_1.default(), maxLevel = 0;\r\n        !node && (node = this.root);\r\n        if (node) {\r\n            queue.enqueue({ node: node, level: 1 });\r\n            while (!queue.empty) {\r\n                let father = queue.dequeue();\r\n                maxLevel = Math.max(maxLevel, father.level);\r\n                yield {\r\n                    node: father.node,\r\n                    level: father.level\r\n                };\r\n                father.node.children.forEach((child) => queue.enqueue({ node: child, level: father.level + 1 }));\r\n            }\r\n        }\r\n        return maxLevel;\r\n    }\r\n    *postOrderEnumerator(node) {\r\n        let stack = new Stack_1.default(), count = 0;\r\n        !node && (node = this.root);\r\n        if (node) {\r\n            stack.push({ node: node, t: false });\r\n            while (!stack.empty) {\r\n                let n = stack.peek();\r\n                if (n.t) {\r\n                    count++;\r\n                    yield n.node;\r\n                    stack.pop();\r\n                }\r\n                else {\r\n                    n.t = true;\r\n                    for (let children = n.node.children, i = children.length - 1; i >= 0; i--) {\r\n                        stack.push({ node: children[i], t: false });\r\n                    }\r\n                }\r\n            }\r\n        }\r\n        return count;\r\n    }\r\n    *breathSearchEnumerator(node) {\r\n        let queue = new Queue_1.default(), count = 0;\r\n        !node && (node = this.root);\r\n        if (node) {\r\n            queue.enqueue(node);\r\n            while (!queue.empty) {\r\n                node = queue.dequeue();\r\n                count++;\r\n                yield node;\r\n                node.children.forEach(child => queue.enqueue(child));\r\n            }\r\n        }\r\n        return count;\r\n    }\r\n}\r\nexports.BaseTree = BaseTree;\r\nclass Tree extends BaseTree {\r\n    constructor(root, comparer) {\r\n        super(comparer);\r\n        this.root = root;\r\n    }\r\n    /**\r\n     * @description implements a breadth search\r\n     * @param value value to search\r\n     */\r\n    find(value) {\r\n        let queue = new Queue_1.default(), node = this.root;\r\n        if (node) {\r\n            queue.enqueue(node);\r\n            while (!queue.empty) {\r\n                node = queue.dequeue();\r\n                if (this.comparer(node.value, value) == 0) {\r\n                    queue.clear();\r\n                    return node;\r\n                }\r\n                else {\r\n                    node.children.forEach(child => queue.enqueue(child));\r\n                }\r\n            }\r\n        }\r\n        return;\r\n    }\r\n}\r\nexports.Tree = Tree;\r\nfunction compare(a, b) {\r\n    if (a == b)\r\n        return 0;\r\n    else if (a > b)\r\n        return 1;\r\n    else\r\n        return -1;\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/Tree.ts?");

/***/ }),

/***/ "./src/lib/Utils.ts":
/*!**************************!*\
  !*** ./src/lib/Utils.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.html = exports.svg = exports.tag = exports.attr = exports.css = exports.isStr = exports.enumConditional = exports.matrix = exports.selectMany = exports.range = exports.replaceAt = exports.formatNumber = exports.centerPadStr = exports.centerStr = exports.padStr = exports.fillChar = exports.pad = exports.toBool = void 0;\r\nvar a = {\r\n    'true': true,\r\n    'false': false,\r\n    'undefined': false,\r\n    'null': false,\r\n    '1': true,\r\n    '0': false\r\n};\r\nconst svgNS = \"http://www.w3.org/2000/svg\";\r\nexports.toBool = (val) => a[val];\r\n//used for string & numbers\r\nexports.pad = (t, e, ch) => new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch ? ch : '0') + t;\r\nexports.fillChar = (ch, len) => new Array(len).join(ch);\r\nexports.padStr = (s, width) => new Array(Math.max(0, width - s.length)).join(' ') + s;\r\nexports.centerStr = (s, width) => {\r\n    let w = (width - s.length) / 2 | 0;\r\n    return (exports.fillChar(' ', w + 1) + s + exports.fillChar(' ', w + 1)).substr(0, width);\r\n};\r\nexports.centerPadStr = (str, width, leftStr, rightStr) => {\r\n    let w = (width - str.length) / 2 | 0, getChar = (s) => (s && (s = s[0]), s || ' ');\r\n    return (exports.fillChar(getChar(leftStr), w + 1) + str + exports.fillChar(getChar(rightStr), w + 1)).substr(0, width);\r\n};\r\nexports.formatNumber = (n, width) => exports.padStr(n + \"\", width);\r\nexports.replaceAt = (str, index, replacement) => str.substr(0, index) + replacement + str.substr(index + replacement.length);\r\nexports.range = (s, e) => Array.from('x'.repeat(e - s), (_, i) => s + i);\r\nexports.selectMany = (input, selectListFn) => input.reduce((out, inx) => {\r\n    out.push(...selectListFn(inx));\r\n    return out;\r\n}, new Array());\r\nexports.matrix = (rows, cols, filler) => Array.from({ length: rows }, () => new Array(cols).fill(filler));\r\nexports.enumConditional = (start, max, discovered) => {\r\n    var nextNdx = (ndx) => ndx >= max ? 0 : ++ndx, curr = start < 0 || start > max ? -1 : start, first = true;\r\n    return {\r\n        current: () => curr,\r\n        next: () => {\r\n            if (curr < 0)\r\n                return false;\r\n            if (first) {\r\n                return first = false, true;\r\n            }\r\n            else {\r\n                while (!((curr = nextNdx(curr)) == start || !discovered(curr)))\r\n                    ;\r\n                return curr != start;\r\n            }\r\n        }\r\n    };\r\n};\r\nexports.isStr = (s) => typeof s === \"string\";\r\nexports.css = (el, styles) => {\r\n    if (exports.isStr(styles))\r\n        return el.style[styles];\r\n    for (let prop in styles)\r\n        el.style[prop] = styles[prop];\r\n    return el;\r\n};\r\nexports.attr = function (el, attrs) {\r\n    if (exports.isStr(attrs))\r\n        return el.getAttribute(attrs);\r\n    for (let attr in attrs)\r\n        el.setAttribute(attr, attrs[attr]);\r\n    return el;\r\n};\r\nexports.tag = (tagName, id, nsAttrs) => (id && (nsAttrs.id = id),\r\n    exports.attr(document.createElementNS(svgNS, tagName), nsAttrs));\r\nexports.svg = (html) => {\r\n    let template = document.createElementNS(svgNS, \"template\");\r\n    template.innerHTML = html;\r\n    return template.children[0];\r\n};\r\nexports.html = (html) => {\r\n    let template = document.createElement(\"template\");\r\n    template.innerHTML = html;\r\n    return template.content.firstChild;\r\n};\r\n\n\n//# sourceURL=webpack:///./src/lib/Utils.ts?");

/***/ }),

/***/ "./src/test/css/styles.css":
/*!*********************************!*\
  !*** ./src/test/css/styles.css ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/test/css/styles.css?");

/***/ }),

/***/ "./src/test/index.ts":
/*!***************************!*\
  !*** ./src/test/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst AVLTree_1 = __webpack_require__(/*! ../lib/AVLTree */ \"./src/lib/AVLTree.ts\");\r\nconst RedBlackTree_1 = __webpack_require__(/*! ../lib/RedBlackTree */ \"./src/lib/RedBlackTree.ts\");\r\nconst tree_utils_1 = __webpack_require__(/*! ./tree-utils */ \"./src/test/tree-utils.ts\");\r\nconst Graph_Utils_1 = __webpack_require__(/*! ../lib/Graph-Utils */ \"./src/lib/Graph-Utils.ts\");\r\nconst Utils_1 = __webpack_require__(/*! src/lib/Utils */ \"./src/lib/Utils.ts\");\r\nlet avl = new AVLTree_1.AVLTree(), rbt = new RedBlackTree_1.RedBlackTree(), svg = document.querySelector('svg'), leftpad = 20, toppad = 40, xstart = leftpad, ystart = toppad, rowHeight = ystart, viewbox = Utils_1.attr(svg, \"viewBox\").split(' '), vbWidth = parseFloat(viewbox[2]) | 0, vbHeight = parseFloat(viewbox[3]) | 0;\r\nconsole.log('viewBox: ', viewbox, ', w: ', vbWidth, ', h: ', vbHeight);\r\navl.insertRange([15, 27, 19, 36, 52, 29, 18, 4]);\r\nlet svgTree = tree_utils_1.visulizeBTree(avl, svg, \"AVL Tree\", xstart, ystart);\r\nconsole.log(svgTree);\r\nxstart += leftpad * 2 + svgTree.width;\r\nrowHeight = Math.max(rowHeight, svgTree.height);\r\n//rbt.insertRange([7, 6, 5, 4, 3, 2, 1]);\r\ninsertRange(rbt, [7, 6, 5, 4, 3, 2, 1]);\r\nsvgTree = tree_utils_1.visulizeBTree(rbt, svg, \"Red-Black Tree Insert\", xstart, ystart, (node) => RedBlackTree_1.RedBlackEnum[node.color]);\r\nlet ino = Graph_Utils_1.generatorObjToArray(rbt.inOrderEnumerator(), (value) => value.value);\r\nconsole.log('in-order Insert:   ', ino.array.join(' '));\r\nxstart += leftpad * 2 + svgTree.width;\r\nrowHeight = Math.max(rowHeight, svgTree.height);\r\nrbt = new RedBlackTree_1.RedBlackTree();\r\n//rbt.insertRange([10, 20, 30, 15]);\r\ninsertRange(rbt, [10, 20, 30, 15]);\r\nsvgTree = tree_utils_1.visulizeBTree(rbt, svg, \"Red-Black Tree 2\", xstart, ystart, (node) => RedBlackTree_1.RedBlackEnum[node.color]);\r\nxstart = leftpad * 2;\r\nystart += rowHeight + toppad * 2;\r\nrowHeight = 0;\r\nrbt = new RedBlackTree_1.RedBlackTree();\r\n//rbt.insertRange([7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13]);\r\ninsertRange(rbt, [7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13]);\r\nsvgTree = tree_utils_1.visulizeBTree(rbt, svg, \"Red-Black Tree Delete\", xstart, ystart, (node) => RedBlackTree_1.RedBlackEnum[node.color]);\r\nxstart += leftpad * 2 + svgTree.width;\r\nrowHeight = Math.max(rowHeight, svgTree.height);\r\nino = Graph_Utils_1.generatorObjToArray(rbt.inOrderEnumerator(), (value) => value.value);\r\nconsole.log('in-order Delete:   ', ino.array.join(' '));\r\nfunction insertRange(tree, array) {\r\n    array.forEach(value => tree.insert(value));\r\n}\r\ndeleteNode(rbt, 18);\r\ndeleteNode(rbt, 11);\r\ndeleteNode(rbt, 3);\r\ndeleteNode(rbt, 10);\r\ndeleteNode(rbt, 22);\r\ndeleteNode(rbt, 26);\r\ndeleteNode(rbt, 13);\r\ndeleteNode(rbt, 8);\r\ndeleteNode(rbt, 7);\r\ndeleteNode(rbt, 6);\r\ndeleteNode(rbt, 2);\r\nfunction deleteNode(t, node) {\r\n    t.delete(node);\r\n    svgTree = tree_utils_1.visulizeBTree(t, svg, `RedBlackTree delete ${node}`, xstart, ystart, (node) => RedBlackTree_1.RedBlackEnum[node.color]);\r\n    rowHeight = Math.max(rowHeight, svgTree.height);\r\n    if (svgTree.width + xstart > vbWidth) {\r\n        xstart = leftpad * 2;\r\n        ystart += rowHeight + toppad * 2;\r\n        rowHeight = 0;\r\n        svgTree.svg.setAttribute(\"transform\", `translate(${xstart} ${ystart})`);\r\n    }\r\n    xstart += leftpad * 2 + svgTree.width;\r\n    let ino = Graph_Utils_1.generatorObjToArray(t.inOrderEnumerator(), (value) => value.value);\r\n    //console.log(`in-order after delete (${node})`, ino.array.join(' '));\r\n}\r\n\n\n//# sourceURL=webpack:///./src/test/index.ts?");

/***/ }),

/***/ "./src/test/tree-utils.ts":
/*!********************************!*\
  !*** ./src/test/tree-utils.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.visulizeBTree = void 0;\r\nconst Utils_1 = __webpack_require__(/*! ../lib/Utils */ \"./src/lib/Utils.ts\");\r\nconst WIDTH = 80;\r\nconst HEIGHT = 120;\r\nconst FONT_SIZE = 40;\r\nfunction visulizeBTree(tree, svg, caption, x, y, nodeClass) {\r\n    let depth = 0, width = 0, height = 0, svgTree = Utils_1.tag(\"g\", \"\", {\r\n        class: \"svg-tree\",\r\n        transform: `translate(${x} ${y})`\r\n    }), svgCaption = Utils_1.tag(\"text\", \"\", {\r\n        \"font-size\": FONT_SIZE,\r\n    });\r\n    if (tree) {\r\n        svg.appendChild(svgTree);\r\n        depth = tree.depth();\r\n        width = depth == 1 ? 1 : Math.pow(2, depth - 1);\r\n        width = width * WIDTH;\r\n        height = visualizeNode(tree.root, svgTree, 0, width, 0, nodeClass);\r\n        svgCaption.innerHTML = caption;\r\n        svgTree.appendChild(svgCaption);\r\n        let box = svgCaption.getBBox();\r\n        Utils_1.attr(svgCaption, {\r\n            x: Math.max(0, (width / 2 - box.width / 2) | 0),\r\n            y: height\r\n        });\r\n        box = svgTree.getBBox();\r\n        width = box.width;\r\n        height = box.height;\r\n    }\r\n    return {\r\n        svg: svgTree,\r\n        width: width,\r\n        height: height\r\n    };\r\n}\r\nexports.visulizeBTree = visulizeBTree;\r\nfunction visualizeNode(node, svg, minx, maxx, y, nodeClass) {\r\n    if (node == undefined)\r\n        return 0;\r\n    let halfWidth = WIDTH / 2 | 0, centerX = minx + (maxx - minx) / 2 | 0, centerY = y + halfWidth, circleRadius = WIDTH / 2 | 0, cl = nodeClass ? nodeClass(node) : \"\", nextYStart = y + HEIGHT, svgNode = Utils_1.tag(\"g\", \"\", {\r\n        class: \"svg-node \" + cl,\r\n        transform: `translate(${centerX - circleRadius} ${centerY - circleRadius})`\r\n    }), svgCircle = Utils_1.tag(\"circle\", \"\", {\r\n        cx: circleRadius,\r\n        cy: circleRadius,\r\n        r: circleRadius\r\n    }), svgText = Utils_1.tag(\"text\", \"\", {\r\n        \"font-size\": FONT_SIZE,\r\n        class: \"no-select\"\r\n    });\r\n    if (!node.isLeaf) {\r\n        let childrenY = nextYStart + halfWidth, childrenX = 0;\r\n        if (node.left) {\r\n            childrenX = minx + (centerX - minx) / 2 | 0;\r\n            svg.appendChild(Utils_1.tag(\"line\", \"\", lineAttrs(centerX, centerY, childrenX, childrenY, circleRadius)));\r\n        }\r\n        if (node.right) {\r\n            childrenX = centerX + (maxx - centerX) / 2 | 0;\r\n            svg.appendChild(Utils_1.tag(\"line\", \"\", lineAttrs(centerX, centerY, childrenX, childrenY, circleRadius)));\r\n        }\r\n    }\r\n    svgText.innerHTML = String(node.value);\r\n    svgNode.appendChild(svgCircle);\r\n    svgNode.appendChild(svgText);\r\n    svg.appendChild(svgNode);\r\n    let box = svgText.getBBox();\r\n    Utils_1.attr(svgText, {\r\n        x: circleRadius - box.width / 2 | 0,\r\n        y: circleRadius + box.height / 4 | 0\r\n    });\r\n    return Math.max(nextYStart, visualizeNode(node.left, svg, minx, centerX, nextYStart, nodeClass), visualizeNode(node.right, svg, centerX, maxx, nextYStart, nodeClass));\r\n}\r\nfunction lineAttrs(x1, y1, x2, y2, r) {\r\n    let angle = Math.atan2(y1 - y2, x1 - x2);\r\n    x1 = (x1 - r * Math.cos(angle)) | 0;\r\n    y1 = (y1 - r * Math.sin(angle)) | 0;\r\n    x2 = (x2 + r * Math.cos(angle)) | 0;\r\n    y2 = (y2 + r * Math.sin(angle)) | 0;\r\n    return {\r\n        x1: x1,\r\n        y1: y1,\r\n        x2: x2,\r\n        y2: y2,\r\n        class: \"svg-line\"\r\n    };\r\n}\r\n\n\n//# sourceURL=webpack:///./src/test/tree-utils.ts?");

/***/ }),

/***/ 0:
/*!***********************************************************!*\
  !*** multi ./src/test/index.ts ./src/test/css/styles.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/test/index.ts */\"./src/test/index.ts\");\nmodule.exports = __webpack_require__(/*! ./src/test/css/styles.css */\"./src/test/css/styles.css\");\n\n\n//# sourceURL=webpack:///multi_./src/test/index.ts_./src/test/css/styles.css?");

/***/ })

/******/ });