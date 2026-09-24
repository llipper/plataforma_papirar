"use client"

import { HeaderSearch } from "./header-search"
import { HeaderAccount } from "./header-account"
import { HeaderNotifications } from "./header-notifications"
import { HeaderSettingsButton } from "./header-settings-button"
import { HeaderLanguagePicker } from "./header-language-picker"

export function DashboardHeader() {
  return (
    <div className="ml-auto flex items-center gap-2 pr-4">
      {/* 1. Busca rápida */}
      <HeaderSearch />

      {/* 2. Conta do usuário */}
      <HeaderAccount />

      {/* 3. Notificações */}
      <HeaderNotifications />

      {/* 4. Configuração de Layout e Tema */}
      <HeaderSettingsButton />

      {/* 5. Seletor de Idioma */}
      <HeaderLanguagePicker />
    </div>
  )
}
