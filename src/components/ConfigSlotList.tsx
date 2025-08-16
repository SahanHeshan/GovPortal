import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Clock, Edit, Trash2, Plus, Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { getAvailableSlots, deleteTimeSlot } from "@/api/manage";
import { TimeSlot } from "@/api/interfaces";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
    categoryId: number;
    onCreateSlot?: () => void;
    onEditSlot?: (slot: TimeSlot) => void;
    onRefresh?: () => void;
}

const ConfigSlotList = (props: Props) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showDateFilter, setShowDateFilter] = useState(false);

  const filterSlotsByDate = useCallback((slotsToFilter: TimeSlot[], filterDate?: Date) => {
    if (!filterDate) {
      setFilteredSlots(slotsToFilter);
      return;
    }

    const filterDateStr = format(filterDate, "yyyy-MM-dd");
    const filtered = slotsToFilter.filter(slot => {
      const slotDateStr = format(new Date(slot.booking_date), "yyyy-MM-dd");
      return slotDateStr === filterDateStr;
    });
    
    setFilteredSlots(filtered);
  }, []);

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAvailableSlots(props.categoryId);
      setSlots(response.data);
      // Apply current filter after fetching
      filterSlotsByDate(response.data, selectedDate);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to fetch slots";
      setError(errorMessage);
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  }, [props.categoryId, selectedDate, filterSlotsByDate]);

  // Update filtered slots when date selection changes
  useEffect(() => {
    filterSlotsByDate(slots, selectedDate);
  }, [slots, selectedDate, filterSlotsByDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setShowDateFilter(false);
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
    setShowDateFilter(false);
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteTimeSlot(slotId);
      // Refresh the slots list after deletion
      await fetchSlots();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to delete slot";
      setError(errorMessage);
      console.error("Error deleting slot:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Convert HH:MM:SS to HH:MM
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'full':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'unavailable':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Manage Time Slots
        </CardTitle>
        <CardDescription>
          View, create, and update appointment time slots
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">
                {selectedDate 
                  ? `${filteredSlots.length} Time Slots for ${format(selectedDate, "MMM dd, yyyy")}`
                  : `${filteredSlots.length} Time Slots`
                }
              </h3>
              
              {/* Date Filter Controls */}
              <div className="flex items-center gap-2">
                <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Filter by date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                {selectedDate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearDateFilter}
                    className="h-9 px-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                
                <div className="text-sm text-muted-foreground">
                  {selectedDate && `of ${slots.length} total`}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={props.onCreateSlot}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Slot
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading slots...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchSlots} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {selectedDate ? "No Slots for Selected Date" : "No Time Slots"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {selectedDate 
                    ? "No time slots found for the selected date. Try selecting a different date or create a new slot."
                    : "Create your first time slot to get started"
                  }
                </p>
                {selectedDate ? (
                  <div className="flex gap-2 justify-center">
                    <Button onClick={clearDateFilter} variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Clear Filter
                    </Button>
                    <Button onClick={props.onCreateSlot}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Time Slot
                    </Button>
                  </div>
                ) : (
                  <Button onClick={props.onCreateSlot}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Time Slot
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlots.map((slot) => (
                    <TableRow key={slot.slot_id}>
                      <TableCell className="font-medium">#{slot.slot_id}</TableCell>
                      <TableCell>{new Date(slot.booking_date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-mono">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => props.onEditSlot?.(slot)}
                            disabled={loading}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteSlot(slot.slot_id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ConfigSlotList;