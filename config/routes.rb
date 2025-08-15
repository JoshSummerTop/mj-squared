# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  draw :accounts
  draw :api
  draw :billing
  draw :hotwire_native
  draw :users
  draw :dev if Rails.env.local?

  authenticated :user, lambda { |u| u.admin? } do
    draw :madmin
  end

  resources :announcements, only: [:index, :show]

  namespace :action_text do
    resources :embeds, only: [:create], constraints: {id: /[^\/]+/} do
      collection do
        get :patterns
      end
    end
  end

  scope controller: :static do
    get :about
    get :terms
    get :privacy
    get :reset_app
  end

  match "/404", via: :all, to: "errors#not_found"
  match "/500", via: :all, to: "errors#internal_server_error"

  # Community Platform Routes - Now the main root
  resources :spaces, only: [:index, :new, :create, :show, :edit, :update, :destroy] do
    member do
      post :join
      delete :leave
    end
    resources :posts, only: [:index, :new, :create]
  end

  resources :posts, only: [:index, :show, :edit, :update, :destroy], param: :id do
    resources :comments, only: [:create, :edit, :update, :destroy]
    member do
      post :like
      delete :unlike
    end
  end

  # Dashboard route for authenticated users who want to access the old dashboard
  authenticated :user do
    get "/dashboard", to: "dashboard#show", as: :user_dashboard
  end
  
  # User activity routes  
  namespace :user, module: :users do
    get 'posts', to: 'posts#index', as: :posts
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", :as => :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Community is now the root of the application
  root to: "community#index"
end
