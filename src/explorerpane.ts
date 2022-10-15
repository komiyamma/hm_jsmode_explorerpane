/*
 * Copyright (C) 2022 Akitsugu Komiyama
 * under the MIT License
 *
 * outputpane v1.0.3
 */
/// <reference path="../../hm_jsmode_ts_difinition/types/hm_jsmode_strict.d.ts" />

declare var module: { exports: any };
declare var ExplorerPane: any;
declare var __dirname: string

(function () {
    const guid = "{0F6BBE65-3EE5-49FD-B798-991B421150F1}";

    let op_dllobj: hidemaru.ILoadDllResult = hidemaru.loadDll("HmOutputPane.dll");
    let selfdir: string = null;
    let hidemaruhandlezero = hidemaru.getCurrentWindowHandle();
    function _output(msg: string): boolean {
        let msg_replaced = msg.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");
        return op_dllobj.dllFunc.Output(hidemaruhandlezero, msg_replaced);
    }

    let ep_dllobj: hidemaru.ILoadDllResult = hidemaru.loadDll("HmExplorerPane.dll");
    
    interface SelfDllInfo {
        __filename?: string,
        __dirname?: string,
    }
    // execjsで読み込まれていたら、{filename,directory}のそれぞれのプロパティに有効な値が入る
    function get_including_by_execjs(): SelfDllInfo {

        var cjf = hidemaruGlobal.currentjsfilename();
        var cmf = hidemaruGlobal.currentmacrofilename();
        if (cjf != cmf) {
            var dir: string = cjf.replace(/[\/\\][^\/\\]+?$/, "");
            return {
                __filename: cjf,
                __dirname: dir
            };
        }
        return {};
    }

    var selfinfo: SelfDllInfo = get_including_by_execjs();
    if (typeof (selfinfo.__dirname) != 'undefined') {
        selfdir = selfinfo.__dirname;
    } else if (typeof (module) != 'undefined' && module.exports) {
        selfdir = __dirname;
    } else {
        _output("explorerpane.js モジュールが想定されていない読み込み方法で利用されています。\r\n");
        return;
    }

    var ep_com = hidemaru.createObject(selfdir + "\\" + "explorerpane.dll", "ExplorerPane.ExplorerPane");
    if (!ep_com) {
        _output("explorerpane.dllが読み込めませんでした。\r\n");
        return;
    }

    function _setMode(mode: number): number {
        return ep_dllobj.dllFunc.SetMode(hidemaruhandlezero, mode);
    }

    function _getMode(): number {
        return ep_dllobj.dllFunc.GetMode(hidemaruhandlezero);
    }

    function _loadProject(filepath: string): number {
        return ep_dllobj.dllFunc.LoadProject(hidemaruhandlezero, filepath);
    }

    function _saveProject(filepath: string): number {
        return ep_dllobj.dllFunc.SaveProject(hidemaruhandlezero, filepath);
    }

    function _getProject(): string {
        return ep_dllobj.dllFuncStr.GetProject(hidemaruhandlezero);
    }

    function _getUpdated(): number {
        return ep_dllobj.dllFunc.GetUpdated(hidemaruhandlezero);
    }

    function _getCurrentDir(): string {
        return ep_dllobj.dllFuncStr.GetCurrentDir(hidemaruhandlezero);
    }

    let ep_windowhandle = null;
    function _getWindowHandle(): number {

        ep_windowhandle = ep_dllobj.dllFunc.GetWindowHandle(hidemaruhandlezero);

        return ep_windowhandle;
    }

    function _sendMessage(command_id: number): number {
        if (typeof(command_id) != "number") {
            return 0;
        }

        if (ep_com) {
            let ret = ep_com.ExplorerPane_SendMessage(command_id);
            return ret;
        }
        return 0;
    }

    let _ExplorerPane = {
        setMode : _setMode,
        getMode : _getMode,
        loadProject : _loadProject,
        saveProject : _saveProject,
        getProject : _getProject,
        getUpdated : _getUpdated,
        getCurrentDir : _getCurrentDir,
        getWindowHandle: _getWindowHandle,
        sendMessage: _sendMessage,
    };

    if (typeof (module) != 'undefined' && module.exports) {
        module.exports = _ExplorerPane;
    } else {
        if (typeof (ExplorerPane) != 'undefined') {
            if (ExplorerPane.guid == null || ExplorerPane.guid != guid) {
                _output("本モジュールとは異なるExplorerPaneが、すでに定義されています。\r\n上書きします。\r\n");
            }

            // 一致していたら上書きはしない
            if (ExplorerPane.guid == guid) {
                return;
            }
        }

        ExplorerPane = _ExplorerPane;
        ExplorerPane.guid = guid;
    }
})();