from api.views.users.models import Purchase


def can_user_access_sheet(user, sheet):
    if not sheet.is_secret:
        return True
    elif sheet.note.created_by.username == user.username:
        return True
    elif Purchase.objects.filter(user=user, note=sheet.note).first() is not None:
        return True
    else:
        return False


def can_user_create_sheet(user, note):
    return user.username == note.created_by.username

