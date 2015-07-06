describe("General Tooltip Tests", function(){
    it("autoSuggest - detection", function() {
        typeLine("rect(44");
        expect(TTE.currentTooltip).to.be.equal(TTE.tooltips.autoSuggest);
    });

    it("autoSuggest vs numberScrubber (click)", function() {
        var line = "rect(12, 34, 56, 78);";
        var pre = "rect(12";
            
        var e = getTooltipRequestEvent(line, pre);
        TTE.editor._emit("requestTooltip", e)
        expect(TTE.currentTooltip).to.be.equal(TTE.tooltips.autoSuggest);

        e = getTooltipRequestEvent(line, pre); // Reset propagationStopped
        e.source = {action: "click"};
        TTE.editor._emit("requestTooltip", e)
        expect(TTE.currentTooltip).to.be.equal(TTE.tooltips.numberScrubber);
    })

    it("Remove succeeds", function() {
        TTE.remove();
        expect($('.tooltip').length).to.be.equal(0);
    });

    it("ACE anti-undo hack still works", function() {
        TTE.editor.setValue("");
        //TTE.editor.session.getUndoManager().reset(); // This seems to disable the undo manager - why?
        typeLine("a(5);");
        var cursor = editor.getCursorPosition();
        var Range = ace.require("ace/range").Range;
        var range = new Range(cursor.row, cursor.column-3, cursor.row, cursor.column-2);
        editor.session.replace(range, "6");
        expect(getLine()).to.be.equal("a(6);");
        editor.session.replace(range, "7");
        expect(getLine()).to.be.equal("a(7);");
        editor.undo();
        // This next test will fail because undo() clears the buffer, undoing all changes.
        // I need a way to keep ACE from merging the deltas.
        expect(getLine()).to.be.equal("a(6);");
        editor.session.$fromUndo = true;
        editor.session.replace(range, "7");
        editor.session.replace(range, "8");
        expect(getLine()).to.be.equal("a(8);"); // modifying text still works
        editor.session.$fromUndo = false;
        editor.session.replace(range, "9");
        expect(getLine()).to.be.equal("a(9);"); // modifying text still works
        editor.undo();
        expect(getLine()).to.be.equal("a(8);"); // undo works
        editor.undo();
        expect(getLine()).to.be.equal("a(5);"); // skip the 7 and 8
    });
});
