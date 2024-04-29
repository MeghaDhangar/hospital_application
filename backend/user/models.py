import uuid
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.contrib.auth.hashers import make_password


class UserManager(BaseUserManager):
    def create_user(self, member_id, user_name, user_email, user_role, user_password):
        if not user_email:
            raise ValueError("Users must have an email address")
        
        user = self.model(
            user_email = user_email,
            member_id = member_id,
            user_name = user_name,
            user_password = user_password,
            user_role = user_role,
        )

        user.set_password(user_password)
        user.save(using=self._db)
        return user

    def create_superuser(self, member_id, user_name, user_email, user_role, user_password):
        user = self.create_user(
            member_id = member_id,
            user_name = user_name,
            user_email = user_email,
            user_role = user_role,
            user_password = user_password,
        )

        user.is_admin = True
        user.set_password(user_password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    user_id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False) 
    member_id = models.UUIDField(default = uuid.uuid4, editable = False)
    user_email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    user_name = models.CharField(max_length=255)
    user_role = models.CharField(max_length = 255, choices=(('Admin', 'Admin'),
                                                            ('Manager', 'Manager'),
                                                            ('Doctor', 'Doctor'),
                                                            ('Patient', 'Patient')))
    user_password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_verify = models.BooleanField(default=False)
    status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "user_email"
    REQUIRED_FIELDS = ["user_name"]

    def __str__(self):
        return self.user_email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_admin
    
    def save(self, *args, **kwargs):
        # Hash the password before saving
        self.user_password = make_password(self.user_password)
        super(User, self).save(*args, **kwargs)