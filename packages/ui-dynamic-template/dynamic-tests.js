Tinytest.add(
  "ui-dynamic-template - render template dynamically", function (test, expect) {
    var tmpl = Template.ui_dynamic_test;

    var nameVar = new ReactiveVar;
    var dataVar = new ReactiveVar;
    tmpl.templateName = function () {
      return nameVar.get();
    };
    tmpl.templateData = function () {
      return dataVar.get();
    };

    // No template chosen
    var div = renderToDiv(tmpl);
    test.equal(canonicalizeHtml(div.innerHTML), "");

    // Choose the "ui-dynamic-test-sub" template, with no data context
    // passed in.
    nameVar.set("ui_dynamic_test_sub");
    Deps.flush();
    test.equal(canonicalizeHtml(div.innerHTML), "test");

    // Set a data context.
    dataVar.set({ foo: "bar" });
    Deps.flush();
    test.equal(canonicalizeHtml(div.innerHTML), "testbar");
  });

// Same test as above, but the {{> UI.dynamic}} inclusion has no
// `dataContext` argument.
Tinytest.add(
  "ui-dynamic-template - render template dynamically, no data context",
  function (test, expect) {
    var tmpl = Template.ui_dynamic_test_no_data;

    var nameVar = new ReactiveVar;
    tmpl.templateName = function () {
      return nameVar.get();
    };

    var div = renderToDiv(tmpl);
    test.equal(canonicalizeHtml(div.innerHTML), "");

    nameVar.set("ui_dynamic_test_sub");
    Deps.flush();
    test.equal(canonicalizeHtml(div.innerHTML), "test");
  });


Tinytest.add(
  "ui-dynamic-template - render template " +
    "dynamically, data context gets inherited",
  function (test, expect) {
    var tmpl = Template.ui_dynamic_test_inherited_data;

    var nameVar = new ReactiveVar();
    var dataVar = new ReactiveVar();
    tmpl.templateName = function () {
      return nameVar.get();
    };
    tmpl.context = function () {
      return dataVar.get();
    };

    var div = renderToDiv(tmpl);
    test.equal(canonicalizeHtml(div.innerHTML), "");

    nameVar.set("ui_dynamic_test_sub");
    Deps.flush();
    test.equal(canonicalizeHtml(div.innerHTML), "test");

    // Set the top-level template's data context; this should be
    // inherited by the dynamically-chosen template, since the {{>
    // UI.dynamic}} inclusion didn't include a data argument.
    dataVar.set({ foo: "bar" });
    Deps.flush();
    test.equal(canonicalizeHtml(div.innerHTML), "testbar");
  }
);

Tinytest.add(
  "ui-dynamic-template - render template " +
    "dynamically, data context does not get inherited if " +
    "falsey context is passed in",
  function (test, expect) {
    var tmpl = Template.ui_dynamic_test_falsey_context;

    var nameVar = new ReactiveVar();
    var dataVar = new ReactiveVar();
    tmpl.templateName = function () {
      return nameVar.get();
    };
    tmpl.context = function () {
      return dataVar.get();
    };

    var div = renderToDiv(tmpl);
    test.equal(canonicalizeHtml(div.innerHTML), "");

    nameVar.set("ui_dynamic_test_sub");
    Deps.flush();
    // Even though the data context is falsey, we DON'T expect the
    // subtemplate to inherit the data context from the parent template.
    test.equal(canonicalizeHtml(div.innerHTML), "test");
  }
);
