module PricingHelper
  def pricing_cta(plan)
    (plan.trial_period_days? && (!user_signed_in? || current_account&.pay_subscriptions&.none?)) ? t(".start_trial") : t(".get_started")
  end

  def pricing_link_to(plan, **opts)
    default_options = {class: "w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-200 text-center block"}
    opts = default_options.merge(opts)

    if plan.contact_url.present?
      link_to t(".contact_us"), plan.contact_url, **opts
    else
      link_to pricing_cta(plan), checkout_path(plan: plan), **opts
    end
  end
end
