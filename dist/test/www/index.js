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
/******/ 	var hotCurrentHash = "c655417df2b2f1552f5e";
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
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.AVLTree = exports.AVLTreeNode = void 0;\r\nvar BTree_1 = __webpack_require__(/*! ./BTree */ \"./src/lib/BTree.ts\");\r\nvar Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nvar AVLTreeNode = /** @class */ (function (_super) {\r\n    __extends(AVLTreeNode, _super);\r\n    function AVLTreeNode(value) {\r\n        var _this = _super.call(this, value) || this;\r\n        _this.depth = 1;\r\n        return _this;\r\n    }\r\n    return AVLTreeNode;\r\n}(BTree_1.BTreeNode));\r\nexports.AVLTreeNode = AVLTreeNode;\r\nvar AVLTree = /** @class */ (function (_super) {\r\n    __extends(AVLTree, _super);\r\n    function AVLTree(comparer) {\r\n        return _super.call(this, undefined, comparer) || this;\r\n    }\r\n    AVLTree.prototype.insert = function (value) {\r\n        var stack = new Stack_1.default(), comp = 0, parent = void 0, node = this.root;\r\n        while (node != undefined) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0)\r\n                return false;\r\n            else {\r\n                if (comp < 0) {\r\n                    node = node.left;\r\n                }\r\n                else {\r\n                    node = node.right;\r\n                }\r\n                stack.push(parent);\r\n            }\r\n        }\r\n        if (!parent) {\r\n            this.root = newNode(value);\r\n            this.__size++;\r\n            return true;\r\n        }\r\n        insertNode(parent, node = newNode(value), comp);\r\n        balanceTree(this, stack);\r\n        this.__size++;\r\n        return true;\r\n    };\r\n    AVLTree.prototype.delete = function (value) {\r\n        var stack = new Stack_1.default(), comp = 0, parent = void 0, root = void 0, node = this.root, min = void 0, found = false;\r\n        while (node != undefined && !found) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0)\r\n                found = true;\r\n            else {\r\n                if (comp < 0) {\r\n                    node = node.left;\r\n                }\r\n                else {\r\n                    node = node.right;\r\n                }\r\n                stack.push(parent);\r\n            }\r\n        }\r\n        if (!found)\r\n            return false;\r\n        parent = stack.peek();\r\n        if (node.isLeaf) {\r\n            if (!parent) {\r\n                this.root = void 0;\r\n                this.__size--;\r\n                return true;\r\n            }\r\n            setChild(void 0, parent, this.comparer(node.value, parent.value));\r\n        }\r\n        else if (node.left && node.right) {\r\n            if (getDepth(node.left) >= getDepth(node.right)) {\r\n                root = node.left;\r\n                if (root.right) {\r\n                    min = deleteMin(this, root.right, root, 1);\r\n                    min.right = node.right;\r\n                    min.left = root;\r\n                    root = min;\r\n                }\r\n                else\r\n                    root.right = node.right;\r\n            }\r\n            else {\r\n                root = node.right;\r\n                if (root.left) {\r\n                    min = deleteMin(this, root, node, 1);\r\n                    root.left = void 0;\r\n                    min.left = node.left;\r\n                    min.right = root;\r\n                    root = min;\r\n                }\r\n                else\r\n                    root.left = node.left;\r\n            }\r\n            setDepth(root);\r\n            if (!parent)\r\n                this.root = root;\r\n            else {\r\n                setChild(root, parent, this.comparer(root.value, parent.value));\r\n            }\r\n        }\r\n        else {\r\n            if (!parent) {\r\n                this.root = (node.left || node.right);\r\n                this.__size--;\r\n                return true;\r\n            }\r\n            setChild(node.left || node.right, parent, this.comparer(node.value, parent.value));\r\n        }\r\n        balanceTree(this, stack);\r\n        this.__size--;\r\n        return true;\r\n    };\r\n    return AVLTree;\r\n}(BTree_1.BTree));\r\nexports.AVLTree = AVLTree;\r\nfunction newNode(value) {\r\n    return new AVLTreeNode(value);\r\n}\r\nvar getDepth = function (n) { return (n === null || n === void 0 ? void 0 : n.depth) || 0; };\r\nfunction setDepth(node) {\r\n    var ldepth = getDepth(node.left), rdepth = getDepth(node.right);\r\n    node.depth = Math.max(ldepth, rdepth) + 1;\r\n    return rdepth - ldepth;\r\n}\r\nfunction insertNode(parent, node, comp) {\r\n    if (comp < 0) {\r\n        parent.left = node;\r\n    }\r\n    else {\r\n        parent.right = node;\r\n    }\r\n    return parent;\r\n}\r\nfunction setChild(node, parent, comp) {\r\n    if (comp < 0)\r\n        parent.left = node;\r\n    else\r\n        parent.right = node;\r\n}\r\nfunction deleteMin(tree, node, parent, comp) {\r\n    var stack = new Stack_1.default();\r\n    if (node.left)\r\n        comp = -1;\r\n    while (node.left != undefined) {\r\n        parent = node;\r\n        node = node.left;\r\n        if (node.left)\r\n            stack.push(node);\r\n    }\r\n    setChild(node.right, parent, comp);\r\n    setDepth(parent);\r\n    balanceTree(tree, stack);\r\n    return node;\r\n}\r\nfunction balanceTree(tree, stack) {\r\n    while (!stack.empty) {\r\n        var parent_1 = void 0, node = stack.pop(), balance = setDepth(node), childrenBalance = 0, root = void 0;\r\n        if (node.depth > 2 && Math.abs(balance) > 1) {\r\n            if (balance < 0) {\r\n                root = node.left;\r\n                childrenBalance = getDepth(root.right) - getDepth(root.left);\r\n                if (childrenBalance < 0) {\r\n                    node.left = root.right;\r\n                    root.right = node;\r\n                }\r\n                else {\r\n                    parent_1 = root;\r\n                    root = root.right;\r\n                    parent_1.right = root.left;\r\n                    root.left = parent_1;\r\n                    node.left = root.right;\r\n                    root.right = node;\r\n                    setDepth(parent_1);\r\n                }\r\n            }\r\n            else {\r\n                root = node.right;\r\n                childrenBalance = getDepth(root.right) - getDepth(root.left);\r\n                if (childrenBalance > 0) {\r\n                    node.right = root.left;\r\n                    root.left = node;\r\n                }\r\n                else {\r\n                    parent_1 = root;\r\n                    root = root.left;\r\n                    parent_1.left = root.right;\r\n                    root.right = parent_1;\r\n                    node.right = root.left;\r\n                    root.left = node;\r\n                    setDepth(parent_1);\r\n                }\r\n            }\r\n            setDepth(node);\r\n            setDepth(root);\r\n            parent_1 = stack.peek();\r\n            if (!parent_1) {\r\n                tree.root = root;\r\n            }\r\n            else {\r\n                if (tree.comparer(root.value, parent_1.value) > 0)\r\n                    parent_1.right = root;\r\n                else\r\n                    parent_1.left = root;\r\n                setDepth(parent_1);\r\n            }\r\n        }\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/AVLTree.ts?");

/***/ }),

/***/ "./src/lib/BTree.ts":
/*!**************************!*\
  !*** ./src/lib/BTree.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nvar __generator = (this && this.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\nvar __values = (this && this.__values) || function(o) {\r\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\r\n    if (m) return m.call(o);\r\n    if (o && typeof o.length === \"number\") return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\r\n};\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.BTree = exports.SearchBTreeTraverse = exports.BTreeNode = void 0;\r\nvar Tree_1 = __webpack_require__(/*! ./Tree */ \"./src/lib/Tree.ts\");\r\nvar Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nvar BTreeNode = /** @class */ (function (_super) {\r\n    __extends(BTreeNode, _super);\r\n    function BTreeNode(value, left, right) {\r\n        var _this = _super.call(this, value) || this;\r\n        _this.left = left;\r\n        _this.right = right;\r\n        return _this;\r\n    }\r\n    Object.defineProperty(BTreeNode.prototype, \"isLeaf\", {\r\n        get: function () { return !this.left && !this.right; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(BTreeNode.prototype, \"children\", {\r\n        get: function () {\r\n            return [this.left, this.right].filter(function (item) { return !!item; });\r\n        },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    return BTreeNode;\r\n}(Tree_1.ValueNode));\r\nexports.BTreeNode = BTreeNode;\r\nvar SearchBTreeTraverse;\r\n(function (SearchBTreeTraverse) {\r\n    SearchBTreeTraverse[SearchBTreeTraverse[\"Root\"] = 0] = \"Root\";\r\n    SearchBTreeTraverse[SearchBTreeTraverse[\"Left\"] = 1] = \"Left\";\r\n    SearchBTreeTraverse[SearchBTreeTraverse[\"Right\"] = 2] = \"Right\";\r\n})(SearchBTreeTraverse = exports.SearchBTreeTraverse || (exports.SearchBTreeTraverse = {}));\r\nvar BTree = /** @class */ (function (_super) {\r\n    __extends(BTree, _super);\r\n    function BTree(root, comparer) {\r\n        var e_1, _a;\r\n        var _this = _super.call(this, comparer) || this;\r\n        _this.root = root;\r\n        _this.__size = 0;\r\n        if (_this.root != undefined) {\r\n            try {\r\n                for (var _b = __values(_this.preOrderEnumerator()), _c = _b.next(); !_c.done; _c = _b.next()) {\r\n                    var n = _c.value;\r\n                    _this.__size++;\r\n                }\r\n            }\r\n            catch (e_1_1) { e_1 = { error: e_1_1 }; }\r\n            finally {\r\n                try {\r\n                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\r\n                }\r\n                finally { if (e_1) throw e_1.error; }\r\n            }\r\n        }\r\n        return _this;\r\n    }\r\n    Object.defineProperty(BTree.prototype, \"size\", {\r\n        get: function () { return this.__size; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    BTree.prototype.find = function (value) {\r\n        var key = this.findKey(value);\r\n        //key.comp == 0 && key.node != undefined has a valid found node\r\n        return key.comp == 0 ? key.node : undefined;\r\n    };\r\n    //(LNR)\r\n    BTree.prototype.inOrderEnumerator = function (node) {\r\n        var stack, count, n;\r\n        return __generator(this, function (_a) {\r\n            switch (_a.label) {\r\n                case 0:\r\n                    stack = new Stack_1.default(), count = 0, n = node || this.root;\r\n                    _a.label = 1;\r\n                case 1:\r\n                    if (!(!stack.empty || n != undefined)) return [3 /*break*/, 5];\r\n                    if (!(n != undefined)) return [3 /*break*/, 2];\r\n                    stack.push(n);\r\n                    n = n.left;\r\n                    return [3 /*break*/, 4];\r\n                case 2:\r\n                    n = stack.pop();\r\n                    count++;\r\n                    return [4 /*yield*/, n];\r\n                case 3:\r\n                    _a.sent();\r\n                    n = n.right;\r\n                    _a.label = 4;\r\n                case 4: return [3 /*break*/, 1];\r\n                case 5: return [2 /*return*/, count];\r\n            }\r\n        });\r\n    };\r\n    BTree.prototype.postOrderEnumerator = function (node) {\r\n        var stack, n, lastNodeVisited, count, peekNode;\r\n        return __generator(this, function (_a) {\r\n            switch (_a.label) {\r\n                case 0:\r\n                    stack = new Stack_1.default(), n = node || this.root, count = 0;\r\n                    _a.label = 1;\r\n                case 1:\r\n                    if (!(!stack.empty || n != undefined)) return [3 /*break*/, 6];\r\n                    if (!(n != undefined)) return [3 /*break*/, 2];\r\n                    stack.push(n);\r\n                    n = n.left;\r\n                    return [3 /*break*/, 5];\r\n                case 2:\r\n                    peekNode = stack.peek();\r\n                    if (!(peekNode.right != undefined && lastNodeVisited != peekNode.right)) return [3 /*break*/, 3];\r\n                    n = peekNode.right;\r\n                    return [3 /*break*/, 5];\r\n                case 3:\r\n                    count++;\r\n                    return [4 /*yield*/, peekNode];\r\n                case 4:\r\n                    _a.sent();\r\n                    lastNodeVisited = stack.pop();\r\n                    _a.label = 5;\r\n                case 5: return [3 /*break*/, 1];\r\n                case 6: return [2 /*return*/, count];\r\n            }\r\n        });\r\n    };\r\n    BTree.prototype.newNode = function (value) {\r\n        return new BTreeNode(value);\r\n    };\r\n    BTree.prototype.min = function (node) {\r\n        if (node)\r\n            while (node.left != undefined)\r\n                node = node.left;\r\n        return node;\r\n    };\r\n    BTree.prototype.max = function (node) {\r\n        if (node)\r\n            while (node.right != undefined)\r\n                node = node.right;\r\n        return node;\r\n    };\r\n    BTree.prototype.findKey = function (value) {\r\n        var prevComp = 0, parent = void 0, node = this.root;\r\n        while (node != undefined) {\r\n            var comp = this.comparer(value, node.value);\r\n            if (comp == 0) {\r\n                return {\r\n                    node: node,\r\n                    parent: parent,\r\n                    prevComp: prevComp,\r\n                    comp: 0\r\n                };\r\n            }\r\n            else {\r\n                if (comp < 0) {\r\n                    if (node.left != undefined) {\r\n                        parent = node;\r\n                        prevComp = comp;\r\n                    }\r\n                    node = node.left;\r\n                }\r\n                else {\r\n                    if (node.right != undefined) {\r\n                        parent = node;\r\n                        prevComp = comp;\r\n                    }\r\n                    node = node.right;\r\n                }\r\n            }\r\n        }\r\n        return { node: void 0, parent: void 0, prevComp: 0, comp: 0 };\r\n    };\r\n    BTree.prototype.insert = function (value) {\r\n        var key = this.findKey(value), node = getChild(key.parent, key.prevComp), child = this.newNode(value);\r\n        return (node != undefined) && (setChild(node, child, key.comp), this.__size++, true);\r\n    };\r\n    BTree.prototype.delete = function (value) {\r\n        var key = this.findKey(value);\r\n        if (!(key.comp == 0 && key.node != undefined)) {\r\n            return false;\r\n        }\r\n        if (key.node.isLeaf) {\r\n            setChild(key.parent, void 0, key.prevComp);\r\n        }\r\n        else if (key.node.left == undefined || key.node.right == undefined) {\r\n            setChild(key.parent, getChild(key.node, key.node.left == undefined ? 1 : -1), key.prevComp);\r\n        }\r\n        else {\r\n            var p = void 0, n = key.node.left, comp = n.right == undefined ? -1 : 1;\r\n            while (n.right != undefined) {\r\n                p = n;\r\n                n = n.right;\r\n            }\r\n            key.node.value = n.value;\r\n            if (p == undefined)\r\n                p = key.node;\r\n            setChild(p, n.left, comp);\r\n        }\r\n        this.__size--;\r\n        return true;\r\n    };\r\n    BTree.prototype.insertRange = function (values) {\r\n        var _this = this;\r\n        var array = [];\r\n        values.forEach(function (value) { return array.push(_this.insert(value)); });\r\n        return array;\r\n    };\r\n    BTree.prototype.deleteRange = function (values) {\r\n        var _this = this;\r\n        var array = [];\r\n        values.forEach(function (value) { return array.push(_this.delete(value)); });\r\n        return array;\r\n    };\r\n    return BTree;\r\n}(Tree_1.BaseTree));\r\nexports.BTree = BTree;\r\nfunction getChild(parent, comp) {\r\n    return (parent == undefined) ? undefined : (comp < 0 ? parent.left : parent.right);\r\n}\r\nfunction setChild(parent, node, comp) {\r\n    (parent != undefined) && (comp < 0 ? parent.left = node : parent.right = node);\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/BTree.ts?");

/***/ }),

/***/ "./src/lib/Graph-Utils.ts":
/*!********************************!*\
  !*** ./src/lib/Graph-Utils.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.generatorObjToArray = exports.generatorValueToArray = exports.visulizeTree = exports.displayGraphMatrix = exports.displayMatrix = exports.fromJSON = exports.toMatrix = exports.transposeMatrix = void 0;\r\nvar Graph_1 = __webpack_require__(/*! ./Graph */ \"./src/lib/Graph.ts\");\r\nvar Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/lib/Utils.ts\");\r\nfunction toMatrix(g) {\r\n    var array = Utils_1.matrix(g.size, g.size, 0);\r\n    //row v and column w\r\n    g.edges().forEach(function (edge) { return array[edge.v][edge.w] = 1; });\r\n    return array;\r\n}\r\nexports.toMatrix = toMatrix;\r\n;\r\nfunction transposeMatrix(g) {\r\n    var array = Utils_1.matrix(g.size, g.size, 0);\r\n    //row v and column w\r\n    g.edges().forEach(function (edge) { return array[edge.w][edge.v] = 1; });\r\n    return array;\r\n}\r\nexports.transposeMatrix = transposeMatrix;\r\n//this displays numbers\r\nfunction displayMatrix(matrix) {\r\n    var width = String(matrix.length).length + 1;\r\n    var header = Utils_1.fillChar(' ', width) + '|' + Utils_1.range(0, matrix.length).map(function (n) { return Utils_1.formatNumber(n, width); }).join(' ');\r\n    console.log(header);\r\n    console.log(Utils_1.fillChar('-', header.length + 1));\r\n    Utils_1.range(0, matrix.length).forEach(function (v) {\r\n        console.log(Utils_1.formatNumber(v, width) + '|' + Utils_1.range(0, matrix.length).map(function (w) { return Utils_1.formatNumber(matrix[v][w], width); }).join(' '));\r\n    });\r\n}\r\nexports.displayMatrix = displayMatrix;\r\n//this displays labels\r\nfunction displayGraphMatrix(g) {\r\n    var matrix = toMatrix(g), width = Math.max.apply(null, g.nodeList().map(function (n) { return n.label().length; })) + 1;\r\n    var header = Utils_1.fillChar(' ', width) + '|' + Utils_1.range(0, g.size).map(function (n) { return Utils_1.formatNumber(n, width); }).join(' ');\r\n    console.log(header);\r\n    console.log(Utils_1.fillChar('-', header.length + 1));\r\n    Utils_1.range(0, g.size).forEach(function (v) {\r\n        console.log(Utils_1.formatNumber(v, width) + '|' + Utils_1.range(0, g.size).map(function (w) { return Utils_1.formatNumber(matrix[v][w], width); }).join(' '));\r\n    });\r\n}\r\nexports.displayGraphMatrix = displayGraphMatrix;\r\nfunction fromJSON(content) {\r\n    var name = content[\"name\"], directed = Utils_1.toBool(content[\"directed\"]), weighted = Utils_1.toBool(content[\"weighted\"]), labeled = !!content[\"labels\"], labels = (labeled ? Array.from(content[\"labels\"]) : undefined), labelMap = new Map(), nodes = labeled ? 0 : parseInt(content[\"nodes\"]), edges = Array.from(content[\"edges\"]), getNode = function (nodeOrLabel) {\r\n        if (labeled) {\r\n            var n = labelMap.get(nodeOrLabel);\r\n            return {\r\n                node: n != undefined ? n : -1,\r\n                label: nodeOrLabel\r\n            };\r\n        }\r\n        else\r\n            return { node: g.hasNode(nodeOrLabel) ? nodeOrLabel : -1 };\r\n    }, getEdge = function (e) { return ({\r\n        v: getNode(e.from),\r\n        w: getNode(e.to),\r\n        weight: e.w\r\n    }); }, g = Graph_1.BaseGraph.create(name, directed, weighted, labeled);\r\n    if (labeled) {\r\n        if (!labels)\r\n            throw \"invalid graph labels\";\r\n        labels.forEach(function (label, node) {\r\n            g.addNode(label);\r\n            labelMap.set(label, node);\r\n        });\r\n    }\r\n    else {\r\n        Utils_1.range(0, nodes).forEach(function (n) { return g.addNode(); });\r\n    }\r\n    if (!edges)\r\n        throw \"invalid edges\";\r\n    edges.forEach(function (e) {\r\n        var edge = getEdge(e);\r\n        if (edge.v.node == -1 || edge.w.node == -1)\r\n            throw \"invalid edge: \" + e;\r\n        if (weighted) {\r\n            !edge.weight && (edge.weight = 0);\r\n            g.connect(edge.v.node, edge.w.node, edge.weight);\r\n        }\r\n        else\r\n            g.connect(edge.v.node, edge.w.node);\r\n    });\r\n    return g;\r\n}\r\nexports.fromJSON = fromJSON;\r\nfunction visulizeTree(tree) {\r\n    var columns = 0, map = new Map(), maxLabelWidth = 0, cons = [], newRow = function () { return new Array(columns).fill(Utils_1.fillChar(' ', maxLabelWidth + 1)); }, postOrder = tree.postOrderEnumerator(), result;\r\n    if (!tree || !tree.root) {\r\n        console.log('empty tree');\r\n        return;\r\n    }\r\n    while (!(result = postOrder.next()).done) {\r\n        var node = result.value;\r\n        maxLabelWidth = Math.max(maxLabelWidth, String(node.value).length);\r\n        var w = node.children.map(function (n) { return map.get(n); }).reduce(function (acc, val) { return acc + val; }, 0);\r\n        w = w || 2;\r\n        map.set(node, w);\r\n    }\r\n    !(maxLabelWidth & 1) && (maxLabelWidth++);\r\n    columns = map.get(tree.root);\r\n    visulizeNode(tree.root, 0, 0, columns - 1, cons, newRow, map, maxLabelWidth);\r\n    cons.forEach(function (row) {\r\n        console.log(\"\" + row.join(''));\r\n    });\r\n}\r\nexports.visulizeTree = visulizeTree;\r\nfunction visulizeNode(node, row, mincol, maxcol, cons, newRow, map, maxLabelWidth) {\r\n    var noderow = cons[row * 2], joinsrow = cons[row * 2 + 1], colStart = mincol, columns = [], getIndex = function (mmin, mmax) { return (mmin + (mmax - mmin + 1) / 2 | 0); }, drawLine = function (startcol, endcol) {\r\n        for (var i = startcol + 1; i < endcol; i++) {\r\n            joinsrow[i] = Utils_1.fillChar('─', maxLabelWidth + 1);\r\n        }\r\n    }, rootIndex = getIndex(mincol, maxcol);\r\n    if (!noderow) {\r\n        cons.push(noderow = newRow());\r\n        cons.push(joinsrow = newRow());\r\n    }\r\n    noderow[rootIndex] = Utils_1.centerStr(String(node.value), maxLabelWidth);\r\n    node.children.forEach(function (child) {\r\n        var rootWidth = map.get(child);\r\n        columns.push(getIndex(colStart, colStart + rootWidth - 1));\r\n        visulizeNode(child, row + 1, colStart, colStart + rootWidth - 1, cons, newRow, map, maxLabelWidth);\r\n        colStart += rootWidth;\r\n    });\r\n    if (columns.length) {\r\n        if (columns.length == 1)\r\n            joinsrow[columns.pop()] = Utils_1.centerPadStr('│', maxLabelWidth, ' ', ' ');\r\n        else {\r\n            var startcol = 0, endcol = columns.pop();\r\n            joinsrow[endcol] = Utils_1.centerPadStr('┐', maxLabelWidth, '─', ' ');\r\n            while (columns.length > 1) {\r\n                joinsrow[startcol = columns.pop()] = Utils_1.centerPadStr('┬', maxLabelWidth, '─', '─');\r\n                drawLine(startcol, endcol);\r\n                endcol = startcol;\r\n            }\r\n            joinsrow[startcol = columns.pop()] = Utils_1.centerPadStr('┌', maxLabelWidth, ' ', '─');\r\n            drawLine(startcol, endcol);\r\n            var rootStr = joinsrow[rootIndex], index = rootStr.length / 2 | 0;\r\n            joinsrow[rootIndex] = rootStr[index] == '─'\r\n                ? Utils_1.replaceAt(rootStr, index, '┴') : Utils_1.replaceAt(rootStr, index, '┼');\r\n        }\r\n    }\r\n}\r\nfunction generatorValueToArray(enumerator) {\r\n    var array = new Array(), result;\r\n    while (!(result = enumerator.next()).done) {\r\n        array.push(result.value);\r\n    }\r\n    return {\r\n        array: array,\r\n        value: result.value\r\n    };\r\n}\r\nexports.generatorValueToArray = generatorValueToArray;\r\nfunction generatorObjToArray(enumerator, transformer) {\r\n    var array = new Array(), result;\r\n    while (!(result = enumerator.next()).done) {\r\n        array.push(transformer(result.value));\r\n    }\r\n    return {\r\n        array: array,\r\n        value: result.value\r\n    };\r\n}\r\nexports.generatorObjToArray = generatorObjToArray;\r\n\n\n//# sourceURL=webpack:///./src/lib/Graph-Utils.ts?");

/***/ }),

/***/ "./src/lib/Graph.ts":
/*!**************************!*\
  !*** ./src/lib/Graph.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.LabeledDiGraph = exports.LabeledGraph = exports.WeightedDiGraph = exports.WeightedGraph = exports.DiGraph = exports.Graph = exports.BaseGraph = exports.EdgeVisitEnum = exports.WeightedEdge = exports.Edge = exports.LabeledNode = exports.GraphNode = void 0;\r\nvar Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/lib/Utils.ts\");\r\nvar GraphNode = /** @class */ (function () {\r\n    function GraphNode(id) {\r\n        this.id = id;\r\n    }\r\n    GraphNode.prototype.label = function () { return String(this.id); };\r\n    return GraphNode;\r\n}());\r\nexports.GraphNode = GraphNode;\r\nvar LabeledNode = /** @class */ (function (_super) {\r\n    __extends(LabeledNode, _super);\r\n    function LabeledNode(id, __label) {\r\n        var _this = _super.call(this, id) || this;\r\n        _this.__label = __label;\r\n        if (!__label)\r\n            throw \"empty node label\";\r\n        return _this;\r\n    }\r\n    LabeledNode.prototype.label = function () { return this.__label; };\r\n    return LabeledNode;\r\n}(GraphNode));\r\nexports.LabeledNode = LabeledNode;\r\nvar Edge = /** @class */ (function () {\r\n    function Edge(v, w) {\r\n        this.v = v;\r\n        this.w = w;\r\n    }\r\n    Edge.prototype.label = function () { return \"(\" + this.v + \">\" + this.w + \")\"; };\r\n    return Edge;\r\n}());\r\nexports.Edge = Edge;\r\nvar WeightedEdge = /** @class */ (function (_super) {\r\n    __extends(WeightedEdge, _super);\r\n    function WeightedEdge(v, w, weight) {\r\n        var _this = _super.call(this, v, w) || this;\r\n        _this.weight = weight;\r\n        if (Number.isNaN(weight))\r\n            throw \"invalid edge weight\";\r\n        return _this;\r\n    }\r\n    WeightedEdge.prototype.label = function () { return \"(\" + this.v + \">\" + this.w + \")::\" + this.weight; };\r\n    return WeightedEdge;\r\n}(Edge));\r\nexports.WeightedEdge = WeightedEdge;\r\nvar EdgeVisitEnum;\r\n(function (EdgeVisitEnum) {\r\n    EdgeVisitEnum[EdgeVisitEnum[\"tree\"] = 0] = \"tree\";\r\n    EdgeVisitEnum[EdgeVisitEnum[\"parent\"] = 1] = \"parent\";\r\n    EdgeVisitEnum[EdgeVisitEnum[\"back\"] = 2] = \"back\";\r\n    EdgeVisitEnum[EdgeVisitEnum[\"down\"] = 3] = \"down\";\r\n    EdgeVisitEnum[EdgeVisitEnum[\"cross\"] = 4] = \"cross\";\r\n})(EdgeVisitEnum = exports.EdgeVisitEnum || (exports.EdgeVisitEnum = {}));\r\nvar BaseGraph = /** @class */ (function () {\r\n    function BaseGraph(name, directed, weighted, labeled) {\r\n        this.name = name;\r\n        this.directed = directed;\r\n        this.weighted = weighted;\r\n        this.labeled = labeled;\r\n        this.__nodes = new Map();\r\n        this.modified = false;\r\n    }\r\n    BaseGraph.prototype.label = function () { return this.name; };\r\n    Object.defineProperty(BaseGraph.prototype, \"size\", {\r\n        get: function () { return this.__nodes.size; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(BaseGraph.prototype, \"nextNodeId\", {\r\n        get: function () { return this.size; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    BaseGraph.prototype.node = function (id) { var _a; return (_a = this.__nodes.get(id)) === null || _a === void 0 ? void 0 : _a.node; };\r\n    BaseGraph.prototype.nodeLabel = function (id) { var _a; return ((_a = this.node(id)) === null || _a === void 0 ? void 0 : _a.label()) || \"\"; };\r\n    BaseGraph.prototype.hasNode = function (id) { return !!this.node(id); };\r\n    BaseGraph.prototype.nodeList = function () { return Array.from(this.__nodes.values()).map(function (n) { return n.node; }); };\r\n    BaseGraph.prototype.nodeEdges = function (id) { var _a; return (_a = this.__nodes.get(id)) === null || _a === void 0 ? void 0 : _a.edges; };\r\n    BaseGraph.prototype.edges = function () { return Utils_1.selectMany(Array.from(this.__nodes.values()), function (n) { return n.edges; }); };\r\n    BaseGraph.prototype.nodeDegree = function (node) { var _a; return ((_a = this.nodeEdges(node)) === null || _a === void 0 ? void 0 : _a.length) || 0; };\r\n    BaseGraph.prototype.degrees = function () {\r\n        var _this = this;\r\n        return Array.from({ length: this.size }, function (n, ndx) { return _this.nodeDegree(ndx); });\r\n    };\r\n    BaseGraph.prototype.indegrees = function () {\r\n        var array = new Array(this.size).fill(0);\r\n        this.edges().forEach(function (edge) { return array[edge.w]++; });\r\n        return array;\r\n    };\r\n    BaseGraph.prototype.validNode = function (node) { return node >= 0 && node < this.size; };\r\n    BaseGraph.prototype.addNode = function (label) {\r\n        var node = this.labeled ?\r\n            new LabeledNode(this.nextNodeId, label) :\r\n            new GraphNode(this.nextNodeId);\r\n        this.__nodes.set(node.id, {\r\n            node: node,\r\n            edges: new Array()\r\n        });\r\n        this.modified = true;\r\n        return node;\r\n    };\r\n    BaseGraph.prototype.connect = function (v, w, weight) {\r\n        var _this = this;\r\n        var startNode = this.__nodes.get(v), endNode = this.__nodes.get(w), createEdge = function (nv, nw) {\r\n            return _this.weighted ?\r\n                new WeightedEdge(nv, nw, weight) :\r\n                new Edge(nv, nw);\r\n        };\r\n        if (!startNode || !endNode)\r\n            return false;\r\n        if (startNode.edges.some(function (e) { return e.w == w; }))\r\n            return false;\r\n        startNode.edges.push(createEdge(v, w));\r\n        this.modified = true;\r\n        !this.directed\r\n            && endNode.edges.push(createEdge(w, v));\r\n        return true;\r\n    };\r\n    BaseGraph.prototype.disconnect = function (v, w) {\r\n        var e = getInternalEdge.call(this, v, w);\r\n        if (!e || e.index < 0)\r\n            return false;\r\n        e.edges.splice(e.index, 1);\r\n        this.modified = true;\r\n        if (!this.directed) {\r\n            e = getInternalEdge.call(this, w, v);\r\n            e.edges.splice(e.index, 1);\r\n        }\r\n        return true;\r\n    };\r\n    BaseGraph.prototype.adjacent = function (v, w) {\r\n        var vNode = this.__nodes.get(v);\r\n        return !!(vNode === null || vNode === void 0 ? void 0 : vNode.edges.some(function (n) { return n.w == w; }));\r\n    };\r\n    BaseGraph.prototype.adjacentEdges = function (node) {\r\n        var vNode = this.__nodes.get(node);\r\n        return (vNode === null || vNode === void 0 ? void 0 : vNode.edges.map(function (e) { return e.w; })) || [];\r\n    };\r\n    BaseGraph.prototype.edge = function (v, w) {\r\n        var e = getInternalEdge.call(this, v, w);\r\n        return e === null || e === void 0 ? void 0 : e.edges[e.index];\r\n    };\r\n    BaseGraph.prototype.edgeCount = function () {\r\n        return Array.from(this.__nodes.values()).reduce(function (sum, item) { return sum + item.edges.length; }, 0);\r\n    };\r\n    // max. number of edges = ½ * |V| * ( |V| - 1 ). \r\n    //For undirected simple graphs, the graph density is defined as: \r\n    //D =     2|E|\r\n    //    -----------\r\n    //     |V|(|V| - 1)\r\n    BaseGraph.prototype.density = function () {\r\n        return 2 * this.edgeCount() / (this.size * (this.size - 1));\r\n    };\r\n    BaseGraph.create = function (name, directed, weighted, labeled) {\r\n        if (labeled) {\r\n            if (weighted)\r\n                throw \"weighted labeled graph not supported yet!\";\r\n            else\r\n                return directed ? new LabeledDiGraph(name) : new LabeledGraph(name);\r\n        }\r\n        else {\r\n            if (weighted)\r\n                return directed ? new WeightedDiGraph(name) : new WeightedGraph(name);\r\n            else\r\n                return directed ? new DiGraph(name) : new Graph(name);\r\n        }\r\n    };\r\n    return BaseGraph;\r\n}());\r\nexports.BaseGraph = BaseGraph;\r\nvar Graph = /** @class */ (function (_super) {\r\n    __extends(Graph, _super);\r\n    function Graph(name) {\r\n        return _super.call(this, name, false, false, false) || this;\r\n    }\r\n    return Graph;\r\n}(BaseGraph));\r\nexports.Graph = Graph;\r\nvar DiGraph = /** @class */ (function (_super) {\r\n    __extends(DiGraph, _super);\r\n    function DiGraph(name) {\r\n        return _super.call(this, name, true, false, false) || this;\r\n    }\r\n    return DiGraph;\r\n}(BaseGraph));\r\nexports.DiGraph = DiGraph;\r\nvar BaseWeightedGraph = /** @class */ (function (_super) {\r\n    __extends(BaseWeightedGraph, _super);\r\n    function BaseWeightedGraph(name, directed) {\r\n        return _super.call(this, name, directed, true, false) || this;\r\n    }\r\n    BaseWeightedGraph.prototype.nodeEdges = function (id) { return _super.prototype.nodeEdges.call(this, id); };\r\n    return BaseWeightedGraph;\r\n}(BaseGraph));\r\nvar WeightedGraph = /** @class */ (function (_super) {\r\n    __extends(WeightedGraph, _super);\r\n    function WeightedGraph(name) {\r\n        return _super.call(this, name, false) || this;\r\n    }\r\n    return WeightedGraph;\r\n}(BaseWeightedGraph));\r\nexports.WeightedGraph = WeightedGraph;\r\nvar WeightedDiGraph = /** @class */ (function (_super) {\r\n    __extends(WeightedDiGraph, _super);\r\n    function WeightedDiGraph(name) {\r\n        return _super.call(this, name, true) || this;\r\n    }\r\n    return WeightedDiGraph;\r\n}(BaseWeightedGraph));\r\nexports.WeightedDiGraph = WeightedDiGraph;\r\nvar BaseLabeledGraph = /** @class */ (function (_super) {\r\n    __extends(BaseLabeledGraph, _super);\r\n    function BaseLabeledGraph(name, directed, weighted) {\r\n        return _super.call(this, name, directed, weighted, true) || this;\r\n    }\r\n    BaseLabeledGraph.prototype.node = function (id) { return _super.prototype.node.call(this, id); };\r\n    return BaseLabeledGraph;\r\n}(BaseGraph));\r\nvar LabeledGraph = /** @class */ (function (_super) {\r\n    __extends(LabeledGraph, _super);\r\n    function LabeledGraph(name) {\r\n        return _super.call(this, name, false, false) || this;\r\n    }\r\n    return LabeledGraph;\r\n}(BaseLabeledGraph));\r\nexports.LabeledGraph = LabeledGraph;\r\nvar LabeledDiGraph = /** @class */ (function (_super) {\r\n    __extends(LabeledDiGraph, _super);\r\n    function LabeledDiGraph(name) {\r\n        return _super.call(this, name, true, false) || this;\r\n    }\r\n    return LabeledDiGraph;\r\n}(BaseLabeledGraph));\r\nexports.LabeledDiGraph = LabeledDiGraph;\r\nvar BaseLabeledWeightedGraph = /** @class */ (function (_super) {\r\n    __extends(BaseLabeledWeightedGraph, _super);\r\n    function BaseLabeledWeightedGraph(name, directed) {\r\n        return _super.call(this, name, directed, true) || this;\r\n    }\r\n    BaseLabeledWeightedGraph.prototype.nodeEdges = function (id) { return _super.prototype.nodeEdges.call(this, id); };\r\n    return BaseLabeledWeightedGraph;\r\n}(BaseLabeledGraph));\r\nfunction getInternalEdge(v, w) {\r\n    var n = this.nodes.get(v);\r\n    return n ?\r\n        { node: n.node, edges: n.edges, index: n.edges.findIndex(function (e) { return e.w == w; }) }\r\n        : undefined;\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/Graph.ts?");

/***/ }),

/***/ "./src/lib/Queue.ts":
/*!**************************!*\
  !*** ./src/lib/Queue.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nvar __read = (this && this.__read) || function (o, n) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n};\r\nvar __spread = (this && this.__spread) || function () {\r\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\r\n    return ar;\r\n};\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nvar Queue = /** @class */ (function (_super) {\r\n    __extends(Queue, _super);\r\n    function Queue() {\r\n        return _super !== null && _super.apply(this, arguments) || this;\r\n    }\r\n    Queue.prototype.dequeue = function () { return this.pop(); };\r\n    Queue.prototype.enqueue = function (t) { return this.n.unshift(t); };\r\n    Queue.prototype.peek = function () { return this.n[0]; };\r\n    Queue.prototype.peekback = function () { return _super.prototype.peek.call(this); };\r\n    Queue.from = function (initialData) {\r\n        var _a;\r\n        if (initialData === void 0) { initialData = []; }\r\n        var q = new Queue();\r\n        (_a = q.n).unshift.apply(_a, __spread(initialData));\r\n        return q;\r\n    };\r\n    return Queue;\r\n}(Stack_1.default));\r\nexports.default = Queue;\r\n\n\n//# sourceURL=webpack:///./src/lib/Queue.ts?");

/***/ }),

/***/ "./src/lib/RedBlackTree.ts":
/*!*********************************!*\
  !*** ./src/lib/RedBlackTree.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.RedBlackTree = exports.RedBlackTreeNode = exports.RedBlackEnum = void 0;\r\nvar BTree_1 = __webpack_require__(/*! ./BTree */ \"./src/lib/BTree.ts\");\r\nvar Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nvar RedBlackEnum;\r\n(function (RedBlackEnum) {\r\n    RedBlackEnum[RedBlackEnum[\"red\"] = 0] = \"red\";\r\n    RedBlackEnum[RedBlackEnum[\"black\"] = 1] = \"black\";\r\n})(RedBlackEnum = exports.RedBlackEnum || (exports.RedBlackEnum = {}));\r\nvar RedBlackTreeNode = /** @class */ (function (_super) {\r\n    __extends(RedBlackTreeNode, _super);\r\n    function RedBlackTreeNode(value) {\r\n        var _this = _super.call(this, value) || this;\r\n        _this.color = RedBlackEnum.red;\r\n        return _this;\r\n    }\r\n    return RedBlackTreeNode;\r\n}(BTree_1.BTreeNode));\r\nexports.RedBlackTreeNode = RedBlackTreeNode;\r\nvar RedBlackTree = /** @class */ (function (_super) {\r\n    __extends(RedBlackTree, _super);\r\n    function RedBlackTree(comparer) {\r\n        return _super.call(this, undefined, comparer) || this;\r\n    }\r\n    RedBlackTree.prototype.insert = function (value) {\r\n        var stack = new Stack_1.default(), parent = void 0, node = this.root, comp = 0;\r\n        if (node == undefined) {\r\n            this.root = node = newNode(value);\r\n            node.color = RedBlackEnum.black;\r\n            this.__size++;\r\n            return true;\r\n        }\r\n        while (node != undefined) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0)\r\n                return false;\r\n            else {\r\n                if (comp < 0)\r\n                    node = node.left;\r\n                else\r\n                    node = node.right;\r\n                stack.push(parent);\r\n            }\r\n        }\r\n        node = newNode(value);\r\n        setChild(parent, node, comp);\r\n        balanceAfterInsert(this, node, stack);\r\n        this.__size++;\r\n        return true;\r\n    };\r\n    RedBlackTree.prototype.delete = function (value) {\r\n        var found = false, comp = 0, stack = new Stack_1.default(), parent = void 0, node = this.root, yIsNode, x, ycomp = 0, yParent, y;\r\n        while (node != undefined && !found) {\r\n            var nextComp = this.comparer(value, node.value);\r\n            if (nextComp == 0)\r\n                found = true;\r\n            else {\r\n                parent = node;\r\n                if (nextComp < 0) {\r\n                    node = node.left;\r\n                }\r\n                else {\r\n                    node = node.right;\r\n                }\r\n                stack.push(parent);\r\n                comp = nextComp;\r\n            }\r\n        }\r\n        if (!found)\r\n            return false;\r\n        // \"node\" to be deleted: \r\n        //\t  is a leaf with no children\r\n        //\t  has one child\r\n        //\t  has two children\r\n        // if \"node\" is red, the red black properties still hold.\r\n        // if \"node\" is black, the tree needs rebalancing and/or recolouring\r\n        if (node.left == undefined || node.right == undefined) {\r\n            //node is leaf or has at least one empty child\r\n            y = node;\r\n            yParent = parent;\r\n            yIsNode = true;\r\n        }\r\n        else {\r\n            //node has 2 children\r\n            //replacement node is the leftmost node greater than \"node\"\r\n            stack.push(node);\r\n            y = node.right;\r\n            yParent = node;\r\n            yIsNode = false;\r\n            while (y.left != undefined) {\r\n                stack.push(y);\r\n                yParent = y;\r\n                y = y.left;\r\n            }\r\n        }\r\n        //y has the replacement node here, it's \"value\" content will be copied to \"node\"\r\n        //x is y's only child, it'll be linked to y's parent\r\n        if (y.left != undefined)\r\n            x = y.left;\r\n        else\r\n            x = y.right;\r\n        // replace x's parent with y's parent and link x to proper subtree in parent, this removes y from tree\r\n        if (yParent != undefined) {\r\n            setChild(yParent, x, ycomp = this.comparer(y.value, yParent.value));\r\n        }\r\n        else {\r\n            this.root = x;\r\n            (x != undefined) && (x.color = RedBlackEnum.black);\r\n            this.__size--;\r\n            return true;\r\n        }\r\n        !yIsNode && (node.value = y.value);\r\n        if (y.color == RedBlackEnum.black) {\r\n            // x may be undefined\r\n            balanceAfterDelete(this, x, stack, ycomp);\r\n        }\r\n        this.__size--;\r\n        return true;\r\n    };\r\n    return RedBlackTree;\r\n}(BTree_1.BTree));\r\nexports.RedBlackTree = RedBlackTree;\r\nvar siblingComparer = function (comp) { return comp > 0 ? -1 : 1; };\r\nfunction setChild(parent, node, comp) {\r\n    if (comp < 0)\r\n        parent.left = node;\r\n    else\r\n        parent.right = node;\r\n}\r\nfunction getChild(parent, comp) {\r\n    return (comp < 0 ? parent.left : parent.right);\r\n}\r\nfunction newNode(value) {\r\n    return new RedBlackTreeNode(value);\r\n}\r\nfunction getColor(node) {\r\n    return node == undefined ?\r\n        RedBlackEnum.black :\r\n        node.color;\r\n}\r\nfunction rotateLeft(x, tree, stack, pushParent) {\r\n    var p = stack.peek(), y = x.right;\r\n    x.right = y.left;\r\n    y.left = x;\r\n    pushParent && stack.push(y);\r\n    if (p != undefined)\r\n        setChild(p, y, tree.comparer(y.value, p.value));\r\n    else\r\n        tree.root = y;\r\n}\r\nfunction rotateRight(x, tree, stack, pushParent) {\r\n    var p = stack.peek(), y = x.left;\r\n    x.left = y.right;\r\n    y.right = x;\r\n    pushParent && stack.push(y);\r\n    if (p != undefined)\r\n        setChild(p, y, tree.comparer(y.value, p.value));\r\n    else\r\n        tree.root = y;\r\n}\r\nfunction balanceAfterInsert(tree, x, stack) {\r\n    var t, g, p, y = x.left, comp = 0;\r\n    while (stack.count >= 2 && (p = stack.pop()).color == RedBlackEnum.red) {\r\n        //parent is RED\r\n        g = stack.peek();\r\n        comp = tree.comparer(p.value, g.value);\r\n        //get x's parent uncle y\r\n        if (comp < 0)\r\n            y = g.right;\r\n        else\r\n            y = g.left;\r\n        if (y != undefined && y.color == RedBlackEnum.red) {\r\n            //uncle is RED, change x's parent and uncle to black\r\n            p.color = RedBlackEnum.black;\r\n            y.color = RedBlackEnum.black;\r\n            // grandparent must be red. Why? Every red node that is not \r\n            // a leaf has only black children\r\n            g.color = RedBlackEnum.red;\r\n            stack.pop();\r\n            x = g;\r\n        }\r\n        else {\r\n            //uncle is BLACK\r\n            if (comp < 0) {\r\n                if (tree.comparer(x.value, p.value) > 0) {\r\n                    // x > p, rotate left, make x a left child\r\n                    rotateLeft(p, tree, stack, false);\r\n                    //this's faster than ES6 array destructuring\r\n                    t = x;\r\n                    x = p;\r\n                    p = t;\r\n                }\r\n                // x < p\r\n                p.color = RedBlackEnum.black;\r\n                g.color = RedBlackEnum.red;\r\n                stack.pop();\r\n                rotateRight(g, tree, stack, true);\r\n            }\r\n            else {\r\n                if (tree.comparer(x.value, p.value) < 0) {\r\n                    // x < p, rotate right, make x a right child\r\n                    rotateRight(p, tree, stack, false);\r\n                    //this's faster than ES6 array destructuring\r\n                    t = x;\r\n                    x = p;\r\n                    p = t;\r\n                }\r\n                // x > p\r\n                p.color = RedBlackEnum.black;\r\n                g.color = RedBlackEnum.red;\r\n                stack.pop();\r\n                rotateLeft(g, tree, stack, true);\r\n            }\r\n        }\r\n    }\r\n    tree.root.color = RedBlackEnum.black;\r\n}\r\nfunction balanceAfterDelete(tree, x, stack, comp) {\r\n    var parent, y;\r\n    while (!stack.empty && getColor(x) == RedBlackEnum.black) {\r\n        parent = stack.peek();\r\n        y = getChild(parent, siblingComparer(comp));\r\n        if (comp < 0) {\r\n            //x is left child, y is right child\r\n            if (getColor(y) == RedBlackEnum.red) {\r\n                // x is black, y is red - make both black and rotate\r\n                y.color = RedBlackEnum.black;\r\n                parent.color = RedBlackEnum.red;\r\n                stack.pop();\r\n                rotateLeft(parent, tree, stack, true);\r\n                stack.push(parent);\r\n                y = parent.right;\r\n            }\r\n            if (y == undefined ||\r\n                (getColor(y.left) == RedBlackEnum.black &&\r\n                    getColor(y.right) == RedBlackEnum.black)) {\r\n                //y children are both black or y is a leaf\r\n                (y != undefined) && (y.color = RedBlackEnum.red);\r\n                //move up\r\n                stack.pop();\r\n                x = parent;\r\n                parent = stack.peek();\r\n                (parent != undefined) && (comp = tree.comparer(x.value, parent.value));\r\n            }\r\n            else {\r\n                if (getColor(y.right) == RedBlackEnum.black) {\r\n                    y.left.color = RedBlackEnum.black;\r\n                    y.color = RedBlackEnum.red;\r\n                    rotateRight(y, tree, stack, false);\r\n                    y = getChild(parent, 1);\r\n                }\r\n                y.color = parent.color; // x.parent.color\r\n                parent.color = RedBlackEnum.black;\r\n                y.right.color = RedBlackEnum.black;\r\n                stack.pop();\r\n                rotateLeft(parent, tree, stack, false);\r\n                stack.clear();\r\n                return;\r\n            }\r\n        }\r\n        else {\r\n            //y is left child, x is right child\r\n            //y could be null\r\n            if (getColor(y) == RedBlackEnum.red) {\r\n                // x is black, y is red - make both black and rotate\r\n                y.color = RedBlackEnum.black;\r\n                parent.color = RedBlackEnum.red;\r\n                stack.pop();\r\n                rotateRight(parent, tree, stack, true);\r\n                stack.push(parent);\r\n                y = parent.left;\r\n            }\r\n            if (y == undefined ||\r\n                (getColor(y.left) == RedBlackEnum.black &&\r\n                    getColor(y.right) == RedBlackEnum.black)) {\r\n                //y children are both black or y is a leaf\r\n                (y != undefined) && (y.color = RedBlackEnum.red);\r\n                //move up\r\n                stack.pop();\r\n                x = parent;\r\n                parent = stack.peek();\r\n                (parent != undefined) && (comp = tree.comparer(x.value, parent.value));\r\n            }\r\n            else {\r\n                if (getColor(y.left) == RedBlackEnum.black) {\r\n                    y.right.color = RedBlackEnum.black;\r\n                    y.color = RedBlackEnum.red;\r\n                    rotateLeft(y, tree, stack, false);\r\n                    y = getChild(parent, -1);\r\n                }\r\n                y.color = parent.color; // x.parent.color\r\n                parent.color = RedBlackEnum.black;\r\n                y.left.color = RedBlackEnum.black;\r\n                stack.pop();\r\n                rotateRight(parent, tree, stack, false);\r\n                stack.clear();\r\n                return;\r\n            }\r\n        }\r\n    }\r\n    (x != undefined) && (x.color = RedBlackEnum.black);\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/RedBlackTree.ts?");

/***/ }),

/***/ "./src/lib/Stack.ts":
/*!**************************!*\
  !*** ./src/lib/Stack.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __read = (this && this.__read) || function (o, n) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n};\r\nvar __spread = (this && this.__spread) || function () {\r\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\r\n    return ar;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Stack = /** @class */ (function () {\r\n    function Stack() {\r\n        this.clear();\r\n    }\r\n    Object.defineProperty(Stack.prototype, \"count\", {\r\n        get: function () { return this.n.length; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(Stack.prototype, \"last\", {\r\n        get: function () { return this.n.length - 1; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(Stack.prototype, \"items\", {\r\n        get: function () { return this.n.slice(0); },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(Stack.prototype, \"empty\", {\r\n        get: function () { return !this.n.length; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    Stack.prototype.pop = function () { return this.n.pop(); };\r\n    Stack.prototype.push = function (t) { return this.n.push(t); };\r\n    Stack.prototype.peek = function () { return this.n[this.last]; };\r\n    Stack.prototype.clear = function () { this.n = new Array(); };\r\n    Stack.from = function (initialData) {\r\n        var _a;\r\n        if (initialData === void 0) { initialData = []; }\r\n        var s = new Stack();\r\n        (_a = s.n).push.apply(_a, __spread(initialData));\r\n        return s;\r\n    };\r\n    return Stack;\r\n}());\r\nexports.default = Stack;\r\n\n\n//# sourceURL=webpack:///./src/lib/Stack.ts?");

/***/ }),

/***/ "./src/lib/Tree.ts":
/*!*************************!*\
  !*** ./src/lib/Tree.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nvar __generator = (this && this.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\nvar __read = (this && this.__read) || function (o, n) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n};\r\nvar __spread = (this && this.__spread) || function () {\r\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\r\n    return ar;\r\n};\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.Tree = exports.BaseTree = exports.TreeNode = exports.ValueNode = void 0;\r\nvar Queue_1 = __importDefault(__webpack_require__(/*! ./Queue */ \"./src/lib/Queue.ts\"));\r\nvar Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nvar ValueNode = /** @class */ (function () {\r\n    function ValueNode(value) {\r\n        this.value = value;\r\n    }\r\n    Object.defineProperty(ValueNode.prototype, \"length\", {\r\n        /**\r\n         * @description return the amount of children\r\n         */\r\n        get: function () { return this.children.length; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    /**\r\n     * @description children indexer\r\n     * @param index 0-based index of child\r\n     */\r\n    ValueNode.prototype.get = function (index) { return this.children[index]; };\r\n    return ValueNode;\r\n}());\r\nexports.ValueNode = ValueNode;\r\nvar TreeNode = /** @class */ (function (_super) {\r\n    __extends(TreeNode, _super);\r\n    function TreeNode(value) {\r\n        var childrenNodes = [];\r\n        for (var _i = 1; _i < arguments.length; _i++) {\r\n            childrenNodes[_i - 1] = arguments[_i];\r\n        }\r\n        var _this = _super.call(this, value) || this;\r\n        _this.__children = new (Array.bind.apply(Array, __spread([void 0], childrenNodes)))();\r\n        return _this;\r\n    }\r\n    Object.defineProperty(TreeNode.prototype, \"children\", {\r\n        get: function () { return this.__children.slice(0); },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(TreeNode.prototype, \"size\", {\r\n        get: function () { return this.__children.length; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(TreeNode.prototype, \"isLeaf\", {\r\n        get: function () { return this.size == 0; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    TreeNode.prototype.add = function (value) {\r\n        var n = new TreeNode(value);\r\n        this.__children.push(n);\r\n        return n;\r\n    };\r\n    TreeNode.prototype.remove = function (value, comparer) {\r\n        var defaultComparer = function (item) { return item.value === value; }, n = this.__children.findIndex(comparer || defaultComparer);\r\n        return n != -1 ? this.__children.splice(n, 1)[0] : undefined;\r\n    };\r\n    TreeNode.prototype.removeAt = function (index) {\r\n        return index >= 0 && index < this.size ? this.__children.splice(index, 1)[0] : undefined;\r\n    };\r\n    TreeNode.prototype.find = function (value, comparer) {\r\n        var defaultComparer = function (item) { return item.value === value; };\r\n        return this.__children.find(comparer || defaultComparer);\r\n    };\r\n    return TreeNode;\r\n}(ValueNode));\r\nexports.TreeNode = TreeNode;\r\nvar BaseTree = /** @class */ (function () {\r\n    function BaseTree(comparer) {\r\n        this.__comp = comparer || compare;\r\n    }\r\n    BaseTree.prototype.empty = function () { return this.root == undefined; };\r\n    BaseTree.prototype.clear = function () {\r\n        this.root = void 0;\r\n    };\r\n    Object.defineProperty(BaseTree.prototype, \"comparer\", {\r\n        get: function () { return this.__comp; },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    /**\r\n     * @description it calls levelOrder from root, and returns it's result with empty callback.\r\n     */\r\n    BaseTree.prototype.depth = function () {\r\n        var result, enumerator = this.levelOrderEnumerator();\r\n        while (!(result = enumerator.next()).done)\r\n            ;\r\n        return result.value;\r\n    };\r\n    BaseTree.prototype.preOrderEnumerator = function (node) {\r\n        var stack, count, children, i;\r\n        return __generator(this, function (_a) {\r\n            switch (_a.label) {\r\n                case 0:\r\n                    stack = new Stack_1.default(), count = 0;\r\n                    !node && (node = this.root);\r\n                    if (!node) return [3 /*break*/, 3];\r\n                    stack.push(node);\r\n                    _a.label = 1;\r\n                case 1:\r\n                    if (!!stack.empty) return [3 /*break*/, 3];\r\n                    count++;\r\n                    node = stack.pop();\r\n                    return [4 /*yield*/, node];\r\n                case 2:\r\n                    _a.sent();\r\n                    for (children = node.children, i = children.length - 1; i >= 0; i--) {\r\n                        stack.push(children[i]);\r\n                    }\r\n                    return [3 /*break*/, 1];\r\n                case 3: return [2 /*return*/, count];\r\n            }\r\n        });\r\n    };\r\n    BaseTree.prototype.preOrderIterator = function (node) {\r\n        var _a;\r\n        var enumerator = this.preOrderEnumerator(node), iterator = (_a = {\r\n                //Iterator protocol\r\n                next: function () {\r\n                    return enumerator.next();\r\n                }\r\n            },\r\n            //Iterable protocol\r\n            _a[Symbol.iterator] = function () {\r\n                return iterator;\r\n            },\r\n            _a);\r\n        return iterator;\r\n    };\r\n    /**\r\n     * @description it's an extended breadthSearch with a tree node level value\r\n     * @param node root node to calculate level order\r\n     * @param callback a function called for every tree node with it's level 1-based\r\n     */\r\n    BaseTree.prototype.levelOrderEnumerator = function (node) {\r\n        var queue, maxLevel, _loop_1;\r\n        return __generator(this, function (_a) {\r\n            switch (_a.label) {\r\n                case 0:\r\n                    queue = new Queue_1.default(), maxLevel = 0;\r\n                    !node && (node = this.root);\r\n                    if (!node) return [3 /*break*/, 3];\r\n                    queue.enqueue({ node: node, level: 1 });\r\n                    _loop_1 = function () {\r\n                        var father;\r\n                        return __generator(this, function (_a) {\r\n                            switch (_a.label) {\r\n                                case 0:\r\n                                    father = queue.dequeue();\r\n                                    maxLevel = Math.max(maxLevel, father.level);\r\n                                    return [4 /*yield*/, {\r\n                                            node: father.node,\r\n                                            level: father.level\r\n                                        }];\r\n                                case 1:\r\n                                    _a.sent();\r\n                                    father.node.children.forEach(function (child) { return queue.enqueue({ node: child, level: father.level + 1 }); });\r\n                                    return [2 /*return*/];\r\n                            }\r\n                        });\r\n                    };\r\n                    _a.label = 1;\r\n                case 1:\r\n                    if (!!queue.empty) return [3 /*break*/, 3];\r\n                    return [5 /*yield**/, _loop_1()];\r\n                case 2:\r\n                    _a.sent();\r\n                    return [3 /*break*/, 1];\r\n                case 3: return [2 /*return*/, maxLevel];\r\n            }\r\n        });\r\n    };\r\n    BaseTree.prototype.postOrderEnumerator = function (node) {\r\n        var stack, count, n, children, i;\r\n        return __generator(this, function (_a) {\r\n            switch (_a.label) {\r\n                case 0:\r\n                    stack = new Stack_1.default(), count = 0;\r\n                    !node && (node = this.root);\r\n                    if (!node) return [3 /*break*/, 5];\r\n                    stack.push({ node: node, t: false });\r\n                    _a.label = 1;\r\n                case 1:\r\n                    if (!!stack.empty) return [3 /*break*/, 5];\r\n                    n = stack.peek();\r\n                    if (!n.t) return [3 /*break*/, 3];\r\n                    count++;\r\n                    return [4 /*yield*/, n.node];\r\n                case 2:\r\n                    _a.sent();\r\n                    stack.pop();\r\n                    return [3 /*break*/, 4];\r\n                case 3:\r\n                    n.t = true;\r\n                    for (children = n.node.children, i = children.length - 1; i >= 0; i--) {\r\n                        stack.push({ node: children[i], t: false });\r\n                    }\r\n                    _a.label = 4;\r\n                case 4: return [3 /*break*/, 1];\r\n                case 5: return [2 /*return*/, count];\r\n            }\r\n        });\r\n    };\r\n    BaseTree.prototype.breathSearchEnumerator = function (node) {\r\n        var queue, count;\r\n        return __generator(this, function (_a) {\r\n            switch (_a.label) {\r\n                case 0:\r\n                    queue = new Queue_1.default(), count = 0;\r\n                    !node && (node = this.root);\r\n                    if (!node) return [3 /*break*/, 3];\r\n                    queue.enqueue(node);\r\n                    _a.label = 1;\r\n                case 1:\r\n                    if (!!queue.empty) return [3 /*break*/, 3];\r\n                    node = queue.dequeue();\r\n                    count++;\r\n                    return [4 /*yield*/, node];\r\n                case 2:\r\n                    _a.sent();\r\n                    node.children.forEach(function (child) { return queue.enqueue(child); });\r\n                    return [3 /*break*/, 1];\r\n                case 3: return [2 /*return*/, count];\r\n            }\r\n        });\r\n    };\r\n    return BaseTree;\r\n}());\r\nexports.BaseTree = BaseTree;\r\nvar Tree = /** @class */ (function (_super) {\r\n    __extends(Tree, _super);\r\n    function Tree(root, comparer) {\r\n        var _this = _super.call(this, comparer) || this;\r\n        _this.root = root;\r\n        return _this;\r\n    }\r\n    /**\r\n     * @description implements a breadth search\r\n     * @param value value to search\r\n     */\r\n    Tree.prototype.find = function (value) {\r\n        var queue = new Queue_1.default(), node = this.root;\r\n        if (node) {\r\n            queue.enqueue(node);\r\n            while (!queue.empty) {\r\n                node = queue.dequeue();\r\n                if (this.comparer(node.value, value) == 0) {\r\n                    queue.clear();\r\n                    return node;\r\n                }\r\n                else {\r\n                    node.children.forEach(function (child) { return queue.enqueue(child); });\r\n                }\r\n            }\r\n        }\r\n        return;\r\n    };\r\n    return Tree;\r\n}(BaseTree));\r\nexports.Tree = Tree;\r\nfunction compare(a, b) {\r\n    if (a == b)\r\n        return 0;\r\n    else if (a > b)\r\n        return 1;\r\n    else\r\n        return -1;\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/Tree.ts?");

/***/ }),

/***/ "./src/lib/Utils.ts":
/*!**************************!*\
  !*** ./src/lib/Utils.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __read = (this && this.__read) || function (o, n) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n};\r\nvar __spread = (this && this.__spread) || function () {\r\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\r\n    return ar;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.ready = exports.gEId = exports.qSA = exports.qS = exports.rEL = exports.aEL = exports.html = exports.svg = exports.tag = exports.attr = exports.css = exports.isStr = exports.enumConditional = exports.matrix = exports.selectMany = exports.range = exports.replaceAt = exports.formatNumber = exports.centerPadStr = exports.centerStr = exports.padStr = exports.fillChar = exports.pad = exports.toBool = void 0;\r\nvar a = {\r\n    'true': true,\r\n    'false': false,\r\n    'undefined': false,\r\n    'null': false,\r\n    '1': true,\r\n    '0': false\r\n};\r\nvar svgNS = \"http://www.w3.org/2000/svg\";\r\nexports.toBool = function (val) { return a[val]; };\r\n//used for string & numbers\r\nexports.pad = function (t, e, ch) {\r\n    return new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch ? ch : '0') + t;\r\n};\r\nexports.fillChar = function (ch, len) { return new Array(len).join(ch); };\r\nexports.padStr = function (s, width) { return new Array(Math.max(0, width - s.length)).join(' ') + s; };\r\nexports.centerStr = function (s, width) {\r\n    var w = (width - s.length) / 2 | 0;\r\n    return (exports.fillChar(' ', w + 1) + s + exports.fillChar(' ', w + 1)).substr(0, width);\r\n};\r\nexports.centerPadStr = function (str, width, leftStr, rightStr) {\r\n    var w = (width - str.length) / 2 | 0, getChar = function (s) { return (s && (s = s[0]), s || ' '); };\r\n    return (exports.fillChar(getChar(leftStr), w + 1) + str + exports.fillChar(getChar(rightStr), w + 1)).substr(0, width);\r\n};\r\nexports.formatNumber = function (n, width) { return exports.padStr(n + \"\", width); };\r\nexports.replaceAt = function (str, index, replacement) {\r\n    return str.substr(0, index) + replacement + str.substr(index + replacement.length);\r\n};\r\nexports.range = function (s, e) { return Array.from('x'.repeat(e - s), function (_, i) { return s + i; }); };\r\nexports.selectMany = function (input, selectListFn) {\r\n    return input.reduce(function (out, inx) {\r\n        out.push.apply(out, __spread(selectListFn(inx)));\r\n        return out;\r\n    }, new Array());\r\n};\r\nexports.matrix = function (rows, cols, filler) {\r\n    return Array.from({ length: rows }, function () { return new Array(cols).fill(filler); });\r\n};\r\nexports.enumConditional = function (start, max, discovered) {\r\n    var nextNdx = function (ndx) { return ndx >= max ? 0 : ++ndx; }, curr = start < 0 || start > max ? -1 : start, first = true;\r\n    return {\r\n        current: function () { return curr; },\r\n        next: function () {\r\n            if (curr < 0)\r\n                return false;\r\n            if (first) {\r\n                return first = false, true;\r\n            }\r\n            else {\r\n                while (!((curr = nextNdx(curr)) == start || !discovered(curr)))\r\n                    ;\r\n                return curr != start;\r\n            }\r\n        }\r\n    };\r\n};\r\nexports.isStr = function (s) { return typeof s === \"string\"; };\r\nexports.css = function (el, styles) {\r\n    if (exports.isStr(styles))\r\n        return el.style[styles];\r\n    for (var prop in styles)\r\n        el.style[prop] = styles[prop];\r\n    return el;\r\n};\r\nexports.attr = function (el, attrs) {\r\n    if (exports.isStr(attrs))\r\n        return el.getAttribute(attrs);\r\n    for (var attr_1 in attrs)\r\n        el.setAttribute(attr_1, attrs[attr_1]);\r\n    return el;\r\n};\r\nexports.tag = function (tagName, id, nsAttrs) { return (id && (nsAttrs.id = id),\r\n    exports.attr(document.createElementNS(svgNS, tagName), nsAttrs)); };\r\nexports.svg = function (html) {\r\n    var template = document.createElementNS(svgNS, \"template\");\r\n    template.innerHTML = html;\r\n    return template.children[0];\r\n};\r\nexports.html = function (html) {\r\n    var template = document.createElement(\"template\");\r\n    template.innerHTML = html;\r\n    return template.content.firstChild;\r\n};\r\nexports.aEL = function (el, eventName, fn, b) { return el.addEventListener(eventName, fn, b); };\r\nexports.rEL = function (el, eventName, fn, b) { return el.removeEventListener(eventName, fn, b); };\r\nexports.qS = function (s) { return document.querySelector(s); };\r\nexports.qSA = function (s) { return document.querySelectorAll(s); };\r\nexports.gEId = function (id) { return document.getElementById(id); };\r\nexports.ready = function (fn) {\r\n    if (typeof fn != \"function\") {\r\n        return !1;\r\n    }\r\n    if (document.readyState != \"loading\")\r\n        return (fn(), !0);\r\n    else if (document[\"addEventListener\"])\r\n        exports.aEL(document, \"DOMContentLoaded\", fn, false);\r\n    else\r\n        document.attachEvent(\"onreadystatechange\", function () {\r\n            if (document.readyState == \"complete\")\r\n                fn();\r\n        });\r\n    return !0;\r\n};\r\n\n\n//# sourceURL=webpack:///./src/lib/Utils.ts?");

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
eval("\r\nvar __read = (this && this.__read) || function (o, n) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n};\r\nvar _a;\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar AVLTree_1 = __webpack_require__(/*! ../lib/AVLTree */ \"./src/lib/AVLTree.ts\");\r\nvar RedBlackTree_1 = __webpack_require__(/*! ../lib/RedBlackTree */ \"./src/lib/RedBlackTree.ts\");\r\nvar tree_utils_1 = __webpack_require__(/*! ./tree-utils */ \"./src/test/tree-utils.ts\");\r\nvar Graph_Utils_1 = __webpack_require__(/*! ../lib/Graph-Utils */ \"./src/lib/Graph-Utils.ts\");\r\nvar Utils_1 = __webpack_require__(/*! src/lib/Utils */ \"./src/lib/Utils.ts\");\r\nvar svg = document.querySelector('svg'), svgTree, leftpad = 20, toppad = 40, xstart = leftpad, ystart = toppad, rowHeight = ystart, viewbox = Utils_1.attr(svg, \"viewBox\").split(' '), vbWidth = parseFloat(viewbox[2]) | 0, vbHeight = parseFloat(viewbox[3]) | 0, options = {\r\n    svg: svg,\r\n    tree: void 0,\r\n    caption: \"[caption]\",\r\n    WIDTH: 80,\r\n    HEIGHT: 120,\r\n    FONT_SIZE: 40,\r\n    x: 0,\r\n    y: 0,\r\n    nodeValue: function (node) { return String(node); }\r\n}, svgRowItems = [], maxYcaption = Number.MIN_SAFE_INTEGER;\r\nvar x, y, width, height;\r\n_a = __read(viewbox.map(function (s) { return parseFloat(s) | 0; }), 4), x = _a[0], y = _a[1], width = _a[2], height = _a[3];\r\nconsole.log(\"x: \" + x + \", y: \" + y + \", width: \" + width + \", height: \" + height);\r\n//console.log('viewBox: ', viewbox, ', w: ', vbWidth, ', h: ', vbHeight);\r\nvar avl = new AVLTree_1.AVLTree();\r\navl.insertRange([15, 27, 19, 36, 52, 29, 18, 4]);\r\noptions.tree = avl;\r\naddSVGTree(\"AVL Tree\");\r\noptions.tree = new RedBlackTree_1.RedBlackTree();\r\noptions.tree.insertRange([7, 6, 5, 4, 3, 2, 1]);\r\noptions.nodeClass = function (node) { return RedBlackTree_1.RedBlackEnum[node.color]; };\r\naddSVGTree(\"Red-Black Tree 1\");\r\nvar ino = Graph_Utils_1.generatorObjToArray(options.tree.inOrderEnumerator(), function (value) { return value.value; });\r\nconsole.log('in-order Insert:   ', ino.array.join(' '));\r\noptions.tree = new RedBlackTree_1.RedBlackTree();\r\noptions.tree.insertRange([10, 20, 30, 15]);\r\naddSVGTree(\"Red-Black Tree 2\");\r\nmoveToNextRow();\r\noptions.tree = new RedBlackTree_1.RedBlackTree();\r\noptions.tree.insertRange([7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13]);\r\naddSVGTree(\"Red-Black Tree\");\r\nino = Graph_Utils_1.generatorObjToArray(options.tree.inOrderEnumerator(), function (value) { return value.value; });\r\nconsole.log('in-order Delete:   ', ino.array.join(' '));\r\ndeleteNode(options.tree, 18);\r\ndeleteNode(options.tree, 11);\r\ndeleteNode(options.tree, 3);\r\ndeleteNode(options.tree, 10);\r\ndeleteNode(options.tree, 22);\r\ndeleteNode(options.tree, 26);\r\ndeleteNode(options.tree, 13);\r\ndeleteNode(options.tree, 8);\r\ndeleteNode(options.tree, 7);\r\ndeleteNode(options.tree, 6);\r\ndeleteNode(options.tree, 2);\r\nfunction deleteNode(t, node) {\r\n    t.delete(node);\r\n    addSVGTree(\"deleted \" + node);\r\n    var ino = Graph_Utils_1.generatorObjToArray(t.inOrderEnumerator(), function (value) { return value.value; });\r\n    //console.log(`in-order after delete (${node})`, ino.array.join(' '));\r\n}\r\nfunction addSVGTree(caption) {\r\n    options.caption = caption;\r\n    options.x = xstart;\r\n    options.y = ystart;\r\n    svgTree = tree_utils_1.BTreeVisualizer(options);\r\n    rowHeight = Math.max(rowHeight, svgTree.height);\r\n    if (svgTree.width + xstart > vbWidth) {\r\n        moveToNextRow();\r\n        svgTree.svg.setAttribute(\"transform\", \"translate(\" + xstart + \" \" + ystart + \")\");\r\n        svgRowItems = [svgTree.svg];\r\n        maxYcaption = svgTree.height;\r\n    }\r\n    else {\r\n        svgRowItems.push(svgTree.svg);\r\n        //adjust g>text\r\n        maxYcaption = Math.max(maxYcaption, svgTree.height);\r\n        svgRowItems.forEach(function (svg) {\r\n            var text = svg.querySelector(\"text.caption\");\r\n            Utils_1.attr(text, {\r\n                y: maxYcaption\r\n            });\r\n        });\r\n    }\r\n    xstart += leftpad * 2 + svgTree.width;\r\n}\r\nfunction moveToNextRow() {\r\n    xstart = leftpad * 2;\r\n    ystart += rowHeight + toppad * 2;\r\n    rowHeight = 0;\r\n}\r\n\n\n//# sourceURL=webpack:///./src/test/index.ts?");

/***/ }),

/***/ "./src/test/tree-utils.ts":
/*!********************************!*\
  !*** ./src/test/tree-utils.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.BTreeVisualizer = void 0;\r\nvar Utils_1 = __webpack_require__(/*! ../lib/Utils */ \"./src/lib/Utils.ts\");\r\n;\r\nfunction BTreeVisualizer(conf) {\r\n    var depth = 0, width = 0, height = 0, svgTree = Utils_1.tag(\"g\", \"\", {\r\n        class: \"svg-tree\",\r\n        transform: \"translate(\" + (conf.x | 0) + \" \" + (conf.y | 0) + \")\"\r\n    }), svgCaption = Utils_1.tag(\"text\", \"\", {\r\n        class: \"caption\",\r\n        \"font-size\": conf.FONT_SIZE,\r\n    });\r\n    if (conf && conf.tree && conf.svg) {\r\n        conf.svg.appendChild(svgTree);\r\n        depth = conf.tree.depth();\r\n        width = depth == 1 ? 1 : Math.pow(2, depth - 1);\r\n        width = width * conf.WIDTH;\r\n        height = visualizeNode(conf.tree.root, svgTree, 0, width, 0, conf);\r\n        svgCaption.innerHTML = conf.caption || \"[caption]\";\r\n        svgTree.appendChild(svgCaption);\r\n        var box = svgCaption.getBBox();\r\n        Utils_1.attr(svgCaption, {\r\n            x: Math.max(0, (width / 2 - box.width / 2) | 0),\r\n            y: height\r\n        });\r\n        box = svgTree.getBBox();\r\n        width = box.width;\r\n        height = box.height;\r\n    }\r\n    return {\r\n        svg: svgTree,\r\n        width: width,\r\n        height: height\r\n    };\r\n}\r\nexports.BTreeVisualizer = BTreeVisualizer;\r\nfunction visualizeNode(node, svg, minx, maxx, y, conf) {\r\n    if (node == undefined)\r\n        return 0;\r\n    var halfWidth = conf.WIDTH / 2 | 0, centerX = minx + (maxx - minx) / 2 | 0, centerY = y + halfWidth, circleRadius = conf.WIDTH / 2 | 0, cl = conf.nodeClass ? conf.nodeClass(node) : \"\", nextYStart = y + conf.HEIGHT, svgNodeX = centerX - circleRadius, svgNodeY = centerY - circleRadius, svgNode = Utils_1.tag(\"g\", \"\", {\r\n        class: \"svg-node \" + cl,\r\n        transform: \"translate(\" + svgNodeX + \" \" + svgNodeY + \")\"\r\n    }), svgCircle = Utils_1.tag(\"circle\", \"\", {\r\n        cx: circleRadius,\r\n        cy: circleRadius,\r\n        r: circleRadius\r\n    }), svgText = Utils_1.tag(\"text\", \"\", {\r\n        \"font-size\": conf.FONT_SIZE,\r\n        class: \"no-select\"\r\n    });\r\n    svgText.innerHTML = conf.nodeValue(node.value);\r\n    svgNode.appendChild(svgCircle);\r\n    svgNode.appendChild(svgText);\r\n    svg.appendChild(svgNode);\r\n    if (!node.isLeaf) {\r\n        var childrenY = nextYStart + halfWidth, childrenX = 0;\r\n        if (node.left) {\r\n            childrenX = minx + (centerX - minx) / 2 | 0;\r\n            svg.appendChild(Utils_1.tag(\"line\", \"\", lineAttrs(centerX, centerY, childrenX, childrenY, circleRadius)));\r\n        }\r\n        if (node.right) {\r\n            childrenX = centerX + (maxx - centerX) / 2 | 0;\r\n            svg.appendChild(Utils_1.tag(\"line\", \"\", lineAttrs(centerX, centerY, childrenX, childrenY, circleRadius)));\r\n        }\r\n    }\r\n    var box = svgText.getBBox();\r\n    Utils_1.attr(svgText, {\r\n        x: circleRadius - box.width / 2 | 0,\r\n        y: circleRadius + box.height / 4 | 0\r\n    });\r\n    return Math.max(nextYStart, visualizeNode(node.left, svg, minx, centerX, nextYStart, conf), visualizeNode(node.right, svg, centerX, maxx, nextYStart, conf));\r\n}\r\nfunction lineAttrs(x1, y1, x2, y2, r) {\r\n    var angle = Math.atan2(y1 - y2, x1 - x2);\r\n    x1 = (x1 - r * Math.cos(angle)) | 0;\r\n    y1 = (y1 - r * Math.sin(angle)) | 0;\r\n    x2 = (x2 + r * Math.cos(angle)) | 0;\r\n    y2 = (y2 + r * Math.sin(angle)) | 0;\r\n    return {\r\n        x1: x1,\r\n        y1: y1,\r\n        x2: x2,\r\n        y2: y2,\r\n        class: \"svg-line\"\r\n    };\r\n}\r\n\n\n//# sourceURL=webpack:///./src/test/tree-utils.ts?");

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