describe("tooltips_test - test ACE anti-undo hack", function() {
    it("ACE anti-undo hack still works", function(done) {
        var ue = uniqueEditor();
        var editor = ue.editor;
        var tte = ue.tte;
        editor.setValue("");
        editor.onTextInput("a(12");
        // This fails and I don't know why. It worked when using TTE. Could be related
        // to getMockedTooltip() being tied to TTE?
        // Current behavior: editor.currentTooltip is undefined.
        expect(editor.currentTooltip).to.be.equal(tte.tooltips.numberScrubber);
        editor.currentTooltip.updateText("14");
        // Should be a(14
        expect(getLine()).to.be.equal("a(14");
        editor.currentTooltip.updateText("24");
        // should be a(24
        expect(getLine()).to.be.equal("a(24");
        editor.undo();
        setTimeout(function() { // undo is asynchronous
            expect(getLine()).to.be.equal("a(14");
            editor.session.$fromUndo = true;
            editor.currentTooltip.updateText("34");
            editor.currentTooltip.updateText("44");
            editor(getLine()).to.be.equal("a(44"); // modifying text still works
            editor.session.$fromUndo = false;
            editor.currentTooltip.updateText("54");
            expect(getLine()).to.be.equal("a(54"); // modifying text still works
            editor.undo();
            setTimeout(function() {
                expect(getLine()).to.be.equal("a(54"); // Huh? It didn't undo!
                editor.undo();
                setTimeout(function() {
                    expect(getLine()).to.be.equal("a(54"); // Huh? It didn't undo!
                    done()
                }, 0);
            }, 0);
        }, 0);
    });
});

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

});
