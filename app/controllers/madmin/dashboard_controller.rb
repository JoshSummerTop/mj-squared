module Madmin
  class DashboardController < Madmin::ApplicationController
    def show
      @total_revenue = revenue_for_range
      @last_12_mos = revenue_for_range 12.months.ago..Time.current
      @last_month = revenue_for_range Time.current.prev_month.all_month
      @this_month = revenue_for_range Time.current.all_month
      
      # Community metrics
      @total_spaces = ::Space.count
      @total_posts = ::Post.count
      @total_comments = ::Comment.count
      @total_memberships = ::Membership.count
      @spaces_this_month = ::Space.where(created_at: Time.current.all_month).count
      @posts_this_month = ::Post.where(created_at: Time.current.all_month).count
    end

    private

    def revenue_for_range(range = nil)
      query = ::Pay::Charge.all
      query = query.where(created_at: range) if range

      revenue_in_cents = query.sum(:amount)
      refunds_in_cents = query.sum(:amount_refunded)
      (revenue_in_cents - refunds_in_cents) / 100.0
    end
  end
end
