describe("tooltips_test - test ACE anti-undo hack", function() {
    it("ACE anti-undo hack still works", function() {
        TTE.editor.setValue("");
        TTE.editor.onTextInput("a(12");
        expect(TTE.currentTooltip).to.be.equal(TTE.tooltips.numberScrubber);
        TTE.currentTooltip.updateText("14");
        // Should be a(14
        expect(getLine()).to.be.equal("a(14");
        TTE.currentTooltip.updateText("24");
        // should be a(24
        expect(getLine()).to.be.equal("a(24");
        TTE.editor.undo();
        expect(getLine()).to.be.equal("a(24"); // Huh? It didn't undo!
        TTE.editor.session.$fromUndo = true;
        TTE.currentTooltip.updateText("34");
        TTE.currentTooltip.updateText("44");
        expect(getLine()).to.be.equal("a(44"); // modifying text still works
        TTE.editor.session.$fromUndo = false;
        TTE.currentTooltip.updateText("54");
        expect(getLine()).to.be.equal("a(54"); // modifying text still works
        TTE.editor.undo();
        expect(getLine()).to.be.equal("a(54"); // Huh? It didn't undo!
        TTE.editor.undo();
        expect(getLine()).to.be.equal("a(54"); // Huh? It didn't undo!
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
