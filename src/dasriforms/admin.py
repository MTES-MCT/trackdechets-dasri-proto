from django.contrib import admin

from .models import DasriForm, WasteIdentifier, WastePackaging


class WastePackagingInline(admin.TabularInline):
    model = WastePackaging


class WasteIdentifierInline(admin.TabularInline):
    model = WasteIdentifier


@admin.register(DasriForm)
class DasriFormAdmin(admin.ModelAdmin):
    list_display = ["id", "readableId"]
    inlines = [WastePackagingInline, WasteIdentifierInline]
