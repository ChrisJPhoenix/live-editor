describe("numberScrubber - detection", function() {
    var mockedNumberScrubber = getMockedTooltip(tooltipClasses.numberScrubber, ["detector", "initialize"]);

    //numberScrubber
    it("! Before number", function() {
        var line = "Falaffel -123 Falaffel";
        var pre = "Falaffel";
        expect(testMockedTooltipDetection(mockedNumberScrubber, line, pre)).to.be(false);
    });

    it("Start of number", function() {
        var line = "Falaffel 123 Falaffel";
        var pre = "Falaffel ";
        expect(testMockedTooltipDetection(mockedNumberScrubber, line, pre)).to.be(true);
    });

    it("Middle of number", function() {
        var line = "Falaffel 123 Falaffel";
        var pre = "Falaffel 12";
        expect(testMockedTooltipDetection(mockedNumberScrubber, line, pre)).to.be(true);
    });

    it("End of number", function() {
        var line = "Falaffel 123 Falaffel";
        var pre = "Falaffel 123";
        expect(testMockedTooltipDetection(mockedNumberScrubber, line, pre)).to.be(true);
    });

    it("Start of negative", function() {
        var line = "Falaffel -123 Falaffel";
        var pre = "Falaffel ";
        expect(testMockedTooltipDetection(mockedNumberScrubber, line, pre)).to.be(true);
    });

    it("Middle of negative", function() {
        var line = "Falaffel -123 Falaffel";
        var pre = "Falaffel -1";
        expect(testMockedTooltipDetection(mockedNumberScrubber, line, pre)).to.be(true);
    });

    it("! After number", function() {
        var line = "Falaffel 123 Falaffel";
        var pre = "Falaffel 123 ";
        expect(testMockedTooltipDetection(mockedNumberScrubber, line, pre)).to.be(false);
    });

    it("! Random", function() {
        var line = "Alex Rodrigues";
        var pre = "Alex Rod";
        expect(testMockedTooltipDetection(mockedNumberScrubber, line, pre)).to.be(false);
    });
});



describe("numberScrubber - selection (what it replaces)", function() {
    var mockedNumberScrubber = getMockedTooltip(tooltipClasses.numberScrubber, ["detector", "initialize", "updateText"]);

    it("Number", function() {
        var line = "123 1234 -fergus";
        var pre = "123 12";
        var updates = [595];
        var result = "123 595 -fergus";
        testReplace(mockedNumberScrubber, line, pre, updates, result);
    });

    it("Negative number", function() {
        var line = "bob(-124)";
        var pre = "bob(-124";
        var updates = [5956];
        var result = "bob(5956)";
        testReplace(mockedNumberScrubber, line, pre, updates, result);
    });

    it("Subtraction", function() {
        var line = "bob(12-124)";
        var pre = "bob(12-124";
        var updates = [33];
        var result = "bob(12-33)";
        testReplace(mockedNumberScrubber, line, pre, updates, result);
    });

    it("Many replaces", function() {
        var line = "123 1234 -fergus";
        var pre = "123 12";
        var updates = [595, 3434434, 121212];
        var result = "123 121212 -fergus";
        testReplace(mockedNumberScrubber, line, pre, updates, result);
    });
});
describe("numberScrubber - test ACE anti-undo hack", function() {
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
