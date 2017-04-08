module ApplicationHelper
  # awesome print custom in erb
  # great for use with highlight JS
  def apc(object, klass = nil)
    "<div class='highlight #{klass}'> \
      #{ap(object, {
        plain: true,
        index: false,
      })} \
    </div>".html_safe
  end
end
