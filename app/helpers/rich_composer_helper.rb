module RichComposerHelper
  def rich_composer_field(form, field_name, options = {})
    options[:placeholder] ||= "Write something..."
    options[:submit_on_enter] = true unless options.key?(:submit_on_enter)
    
    content_tag :div, 
      data: { 
        controller: "rich-composer",
        rich_composer_placeholder_value: options[:placeholder],
        rich_composer_submit_on_enter_value: options[:submit_on_enter]
      } do
      
      form.hidden_field field_name, 
        data: { rich_composer_target: "hidden" },
        id: options[:id] || "#{form.object_name}_#{field_name}"
    end
  end
end
