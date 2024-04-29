from django.contrib import admin
from user.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.
class UserModelAdmin(BaseUserAdmin):
    list_display = ('user_id', 'user_email', 'user_name', 'is_admin')
    list_filter = ('is_admin',)
    
    fieldsets = (
        ('User Credentials', {'fields': ('user_email', 'user_password')}),
        ('Personal info', {'fields': ('user_name',)}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    
    add_fieldsets = (
        (None, {
            'classes':('wide',),
            'fields':('email', 'user_name', 'user_password',),
            }),
    )
    
    search_fields = ('user_email',)
    ordering = ('user_email',)
    filter_horizontal = ()

admin.site.register(User, UserModelAdmin)