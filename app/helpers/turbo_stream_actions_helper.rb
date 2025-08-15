module TurboStreamActionsHelper
  module CustomTurboStreamActions
    # Add your own custom Turbo StreamAction helpers
    # These will automatically be made available on the `turbo_stream` helper
    # Add the matching StreamAction in `app/javascripts/src/turbo_streams.js`

    # turbo_stream.remove_later("my-id", after: "2000")
    def remove_later(target, after: "2000")
      turbo_stream_action_tag :remove_later, target: target, after: after
    end

    def reset_form(target)
      turbo_stream_action_tag :reset_form, target: target
    end

    def scroll_to(target)
      turbo_stream_action_tag :scroll_to, target: target
    end

    # NEW: Modal-specific stream actions
    def modal_success(target, title:, message:, actions: [])
      turbo_stream_action_tag :modal_success, 
                             target: target,
                             title: title,
                             message: message,
                             actions: actions.to_json
    end

    def modal_error(target, title:, message:, errors: [])
      turbo_stream_action_tag :modal_error,
                             target: target,
                             title: title,
                             message: message,
                             errors: errors.to_json
    end

    def flash_message(message, type: "success", duration: 5000, dismissible: true)
      turbo_stream_action_tag :flash_message,
                             message: message,
                             type: type,
                             duration: duration,
                             dismissible: dismissible
    end

    def loading_state(target, show: true)
      turbo_stream_action_tag :loading_state,
                             target: target,
                             show: show
    end

    def redirect_to_path(path, delay: 0)
      turbo_stream_action_tag :redirect_to_path,
                             path: path,
                             delay: delay
    end
  end

  Turbo::Streams::TagBuilder.prepend(CustomTurboStreamActions)
end
