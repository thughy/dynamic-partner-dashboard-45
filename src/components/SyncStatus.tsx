
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { usePartners } from '@/context/PartnerContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const SyncStatus: React.FC = () => {
  const { syncStatus, getLastSyncTime } = usePartners();
  
  const lastSyncTime = getLastSyncTime();
  const formattedLastSync = lastSyncTime 
    ? format(new Date(lastSyncTime), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
    : 'Nunca sincronizado';
  
  let statusIcon;
  let statusColor;
  
  switch (syncStatus.status) {
    case 'success':
      statusIcon = <CheckCircle className="h-5 w-5 text-emerald-500" />;
      statusColor = 'bg-emerald-50 border-emerald-200 text-emerald-800';
      break;
    case 'error':
      statusIcon = <AlertCircle className="h-5 w-5 text-rose-500" />;
      statusColor = 'bg-rose-50 border-rose-200 text-rose-800';
      break;
    case 'syncing':
      statusIcon = <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      statusColor = 'bg-blue-50 border-blue-200 text-blue-800';
      break;
    default:
      statusIcon = <CheckCircle className="h-5 w-5 text-gray-500" />;
      statusColor = 'bg-gray-50 border-gray-200 text-gray-800';
  }
  
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-1">
        <Alert className={`${statusColor} border-l-4`}>
          <div className="flex items-center gap-2">
            {statusIcon}
            <AlertTitle>
              {syncStatus.status === 'syncing' ? 'Sincronizando...' : 
               syncStatus.status === 'success' ? 'Sincronizado' :
               syncStatus.status === 'error' ? 'Erro na sincronização' : 
               'Status'}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2 text-sm">
            <div>
              {syncStatus.message || 'Sem atualizações recentes'}
            </div>
            <div className="mt-1 text-xs opacity-80">
              Última sincronização: {formattedLastSync}
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SyncStatus;
