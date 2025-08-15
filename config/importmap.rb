# Pin npm packages by running ./bin/importmap

pin "application"
pin_all_from "app/javascript/channels", under: "channels"
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/src", under: "src"

# From gems
pin "@hotwired/stimulus", to: "stimulus.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@rails/actiontext", to: "actiontext.esm.js"
pin "@rails/actioncable", to: "actioncable.esm.js"
pin "@rails/activestorage", to: "activestorage.esm.js"
pin "trix"

# Vendor libraries
pin "@hotwired/hotwire-native-bridge", to: "@hotwired--hotwire-native-bridge.js" # @1.2.1
pin "clipboard" # @2.0.11
pin "local-time", to: "local-time.es2017-esm.js"
pin "tailwindcss-stimulus-components" # @6.1.3
pin "tributejs" # @5.1.3
pin "@floating-ui/dom", to: "@floating-ui--dom.js" # @1.7.3
pin "@floating-ui/core", to: "@floating-ui--core.js" # @1.7.3
pin "@floating-ui/utils", to: "@floating-ui--utils.js" # @0.2.10
pin "@floating-ui/utils/dom", to: "@floating-ui--utils--dom.js"
pin "swiper" # @11.0.5
pin "@tiptap/core", to: "@tiptap--core.js" # @3.2.0
pin "@tiptap/extension-image", to: "@tiptap--extension-image.js" # @3.2.0
pin "@tiptap/extension-link", to: "@tiptap--extension-link.js" # @3.2.0
pin "@tiptap/extension-placeholder", to: "@tiptap--extension-placeholder.js" # @3.2.0
pin "@tiptap/extension-task-item", to: "@tiptap--extension-task-item.js" # @3.2.0
pin "@tiptap/extension-task-list", to: "@tiptap--extension-task-list.js" # @3.2.0
pin "@tiptap/extension-underline", to: "@tiptap--extension-underline.js" # @3.2.0
pin "@tiptap/starter-kit", to: "@tiptap--starter-kit.js" # @3.2.0
pin "emoji-picker-element" # @1.26.3
pin "@tiptap/core/jsx-runtime", to: "@tiptap--core--jsx-runtime.js" # @3.2.0
pin "@tiptap/extension-blockquote", to: "@tiptap--extension-blockquote.js" # @3.2.0
pin "@tiptap/extension-bold", to: "@tiptap--extension-bold.js" # @3.2.0
pin "@tiptap/extension-code", to: "@tiptap--extension-code.js" # @3.2.0
pin "@tiptap/extension-code-block", to: "@tiptap--extension-code-block.js" # @3.2.0
pin "@tiptap/extension-document", to: "@tiptap--extension-document.js" # @3.2.0
pin "@tiptap/extension-hard-break", to: "@tiptap--extension-hard-break.js" # @3.2.0
pin "@tiptap/extension-heading", to: "@tiptap--extension-heading.js" # @3.2.0
pin "@tiptap/extension-horizontal-rule", to: "@tiptap--extension-horizontal-rule.js" # @3.2.0
pin "@tiptap/extension-italic", to: "@tiptap--extension-italic.js" # @3.2.0
pin "@tiptap/extension-list", to: "@tiptap--extension-list.js" # @3.2.0
pin "@tiptap/extension-paragraph", to: "@tiptap--extension-paragraph.js" # @3.2.0
pin "@tiptap/extension-strike", to: "@tiptap--extension-strike.js" # @3.2.0
pin "@tiptap/extension-text", to: "@tiptap--extension-text.js" # @3.2.0
pin "@tiptap/extensions", to: "@tiptap--extensions.js" # @3.2.0
pin "@tiptap/pm/commands", to: "@tiptap--pm--commands.js" # @3.2.0
pin "@tiptap/pm/dropcursor", to: "@tiptap--pm--dropcursor.js" # @3.2.0
pin "@tiptap/pm/gapcursor", to: "@tiptap--pm--gapcursor.js" # @3.2.0
pin "@tiptap/pm/history", to: "@tiptap--pm--history.js" # @3.2.0
pin "@tiptap/pm/keymap", to: "@tiptap--pm--keymap.js" # @3.2.0
pin "@tiptap/pm/model", to: "@tiptap--pm--model.js" # @3.2.0
pin "@tiptap/pm/schema-list", to: "@tiptap--pm--schema-list.js" # @3.2.0
pin "@tiptap/pm/state", to: "@tiptap--pm--state.js" # @3.2.0
pin "@tiptap/pm/transform", to: "@tiptap--pm--transform.js" # @3.2.0
pin "@tiptap/pm/view", to: "@tiptap--pm--view.js" # @3.2.0
pin "linkifyjs" # @4.3.2
pin "orderedmap" # @2.1.1
pin "prosemirror-commands" # @1.7.1
pin "prosemirror-dropcursor" # @1.8.2
pin "prosemirror-gapcursor" # @1.3.2
pin "prosemirror-history" # @1.4.1
pin "prosemirror-keymap" # @1.2.3
pin "prosemirror-model" # @1.25.3
pin "prosemirror-schema-list" # @2.1.0
pin "prosemirror-state" # @1.4.3
pin "prosemirror-transform" # @1.10.4
pin "prosemirror-view" # @1.40.1
pin "rope-sequence" # @1.3.4
pin "w3c-keyname" # @2.2.8
pin "trix"
pin "@rails/actiontext", to: "actiontext.esm.js"
