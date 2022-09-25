/*
 * Copyright (C) 2022 Akitsugu Komiyama
 * under the MIT License
 *
 * outputpane v1.0.1
 */
/// <reference path="../../hm_jsmode_ts_difinition/types/hm_jsmode_strict.d.ts" />
(function () {
    var guid = "{0F6BBE65-3EE5-49FD-B798-991B421150F1}";
    var op_dllobj = hidemaru.loadDll("HmOutputPane.dll");
    var selfdir = null;
    var hidemaruhandlezero = hidemaru.getCurrentWindowHandle();
    function _output(msg) {
        var msg_replaced = msg.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");
        return op_dllobj.dllFunc.Output(hidemaruhandlezero, msg_replaced);
    }
    var ep_dllobj = hidemaru.loadDll("HmExplorerPane.dll");
    // execjsで読み込まれていたら、{filename,directory}のそれぞれのプロパティに有効な値が入る
    function get_including_by_execjs() {
        var cjf = hidemaruGlobal.currentjsfilename();
        var cmf = hidemaruGlobal.currentmacrofilename();
        if (cjf != cmf) {
            var dir = cjf.replace(/[\/\\][^\/\\]+?$/, "");
            return {
                "filename": cjf,
                "directory": dir
            };
        }
        return {};
    }
    var selfinfo = get_including_by_execjs();
    if (typeof (selfinfo.directory) != 'undefined') {
        selfdir = selfinfo.directory;
    }
    else if (typeof (module) != 'undefined' && module.exports) {
        selfdir = module.directory;
    }
    else {
        _output("explorerpane.js モジュールが想定されていない読み込み方法で利用されています。\r\n");
        return;
    }
    var ep_com = hidemaru.createObject(selfdir + "\\" + "explorerpane.dll", "ExplorerPane.ExplorerPane");
    if (!ep_com) {
        _output("explorerpane.dllが読み込めませんでした。\r\n");
        return;
    }
    function _setMode(mode) {
        return ep_dllobj.dllFunc.SetMode(hidemaruhandlezero, mode);
    }
    function _getMode() {
        return ep_dllobj.dllFunc.GetMode(hidemaruhandlezero);
    }
    function _loadProject(filepath) {
        return ep_dllobj.dllFunc.LoadProject(hidemaruhandlezero, filepath);
    }
    function _saveProject(filepath) {
        return ep_dllobj.dllFunc.SaveProject(hidemaruhandlezero, filepath);
    }
    function _getProject() {
        return ep_dllobj.dllFuncStr.GetProject(hidemaruhandlezero);
    }
    function _getUpdated() {
        return ep_dllobj.dllFunc.GetUpdated(hidemaruhandlezero);
    }
    function _getCurrentDir() {
        return ep_dllobj.dllFuncStr.GetCurrentDir(hidemaruhandlezero);
    }
    var ep_windowhandle = null;
    function _getWindowHandle() {
        ep_windowhandle = ep_dllobj.dllFunc.GetWindowHandle(hidemaruhandlezero);
        return ep_windowhandle;
    }
    function _sendMessage(command_id) {
        if (typeof (command_id) != "number") {
            return 0;
        }
        if (ep_com) {
            var ret = ep_com.ExplorerPane_SendMessage(command_id);
            return ret;
        }
        return 0;
    }
    var _ExplorerPane = {
        setMode: _setMode,
        getMode: _getMode,
        loadProject: _loadProject,
        saveProject: _saveProject,
        getProject: _getProject,
        getUpdated: _getUpdated,
        getCurrentDir: _getCurrentDir,
        getWindowHandle: _getWindowHandle,
        sendMessage: _sendMessage,
    };
    if (typeof (module) != 'undefined' && module.exports) {
        module.exports = _ExplorerPane;
    }
    else {
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
