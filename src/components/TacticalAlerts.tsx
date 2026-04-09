import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { TacticalAlert, AlertType } from '../types/advancedSystems';
import { supabase } from '../lib/supabase';

interface TacticalAlertsProps {
  coachId: string;
}

export default function TacticalAlerts({ coachId }: TacticalAlertsProps) {
  const [alerts, setAlerts] = useState<TacticalAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, [coachId]);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('tactical_alerts')
        .select('*')
        .eq('coach_id', coachId)
        .eq('is_active', true)
        .order('severity', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('tactical_alerts')
        .update({ is_active: false })
        .eq('id', alertId);

      if (error) throw error;
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'critical':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getAlertColors = (type: AlertType) => {
    switch (type) {
      case 'critical':
        return 'bg-red-900/30 border-red-500 text-red-200';
      case 'warning':
        return 'bg-yellow-900/30 border-yellow-500 text-yellow-200';
      case 'success':
        return 'bg-green-900/30 border-green-500 text-green-200';
      default:
        return 'bg-blue-900/30 border-blue-500 text-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
        <p className="text-gray-400 text-center">Cargando alertas...</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle size={20} />
          <p className="font-medium">Todo en orden</p>
        </div>
        <p className="text-gray-400 text-sm mt-1">No hay alertas tácticas activas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`border-l-4 rounded-lg p-4 ${getAlertColors(alert.alert_type)} relative`}
        >
          <button
            onClick={() => dismissAlert(alert.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {getAlertIcon(alert.alert_type)}
            </div>
            <div className="flex-1 pr-6">
              <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
              <p className="text-xs opacity-90">{alert.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-black/30 rounded">
                  {alert.category}
                </span>
                <span className="text-xs opacity-70">
                  Severidad: {alert.severity}/4
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
