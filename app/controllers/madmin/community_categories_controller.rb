module Madmin
  class CommunityCategoriesController < Madmin::ResourceController
    def destroy
      @record = resource.model.find(params[:id])
      
      if @record.spaces.exists?
        redirect_to madmin_community_categories_path, alert: "Cannot delete category while it is assigned to spaces."
      else
        @record.destroy
        redirect_to madmin_community_categories_path, notice: "Category deleted successfully."
      end
    end
  end
end
