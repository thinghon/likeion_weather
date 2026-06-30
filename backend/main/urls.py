from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/check-username/', views.check_username_api, name='check_username_api'),
    path('auth/signup/', views.signup_api, name='signup_api'),
    path('auth/login/', views.login_api, name='login_api'),
    path('auth/me/', views.delete_me_api, name='delete_me_api'),

    # Emotions
    path('emotions/', views.emotions_api, name='emotions_api'),
    path('emotions/compare/', views.weather_compare_api, name='weather_compare_api'),
    path('emotions/history/', views.history_api, name='history_api'),
    path('emotions/<int:entry_id>/', views.emotion_detail_api, name='emotion_detail_api'),

    # Region (specific routes before generic)
    path('emotions/region/<str:region_name>/history/', views.region_history_api, name='region_history_api'),
    path('emotions/region/<str:region_name>/', views.region_detail_api, name='region_detail_api'),

    # Weather (서버 프록시 — OpenWeather 키를 클라이언트에 노출하지 않음)
    path('weather/', views.weather_current_api, name='weather_current_api'),

    # Location
    path('location/resolve/', views.location_resolve_api, name='location_resolve_api'),
]
