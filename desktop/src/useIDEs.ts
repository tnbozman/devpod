import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { client } from "./client"
import { useSettings } from "./contexts"
import { QueryKeys } from "./queryKeys"

// See pkg/config/ide.go for names
const FLEET_IDE_NAME = "fleet"
const JUPYTER_IDE_NAME = "jupyternotebook"

export function useIDEs() {
  const idesQuery = useQuery({
    queryKey: QueryKeys.IDES,
    queryFn: async () => (await client.ides.listAll()).unwrap(),
  })
  const settings = useSettings()

  const ides = useMemo(
    () =>
      idesQuery.data?.filter((ide) => {
        if (!ide.experimental) return true

        if (ide.name === FLEET_IDE_NAME && settings.experimental_fleet) return true
        if (ide.name === JUPYTER_IDE_NAME && settings.experimental_jupyterNotebooks) return true

        return false
      }),
    [settings, idesQuery.data]
  )

  return useMemo(
    () => ({ ides, defaultIDE: idesQuery.data?.find((ide) => ide.default) }),
    [ides, idesQuery.data]
  )
}
