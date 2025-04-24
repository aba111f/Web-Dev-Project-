from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Profile


@receiver(pre_save, sender=Profile)
def delete_old_files(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_instance = Profile.objects.get(pk=instance.pk)
        
        if old_instance.PhotoFileName != instance.PhotoFileName:
            if old_instance.PhotoFileName:
                old_instance.PhotoFileName.delete(save=False)
                
        if old_instance.logoName != instance.logoName:
            if old_instance.logoName:
                old_instance.logoName.delete(save=False)
                
    except Profile.DoesNotExist:
        pass